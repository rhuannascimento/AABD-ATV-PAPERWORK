const connectMongo = require('./connectMongo.js');
const mongoose = require('mongoose');
const data = require('./data.json');

async function populateMongo() {
  try {
    await connectMongo();


    const Producer = mongoose.model('Producer');
    const Buyer = mongoose.model('Buyer');
    const PaperProduct = mongoose.model('PaperProduct');
    const Auction = mongoose.model('Auction');
    const Bid = mongoose.model('Bid');
    const Negotiation = mongoose.model('Negotiation');

    
    const idMap = {};


    const saveAndMap = async (model, data) => {
      const { id, ...dataWithoutId } = data; 
      const doc = new model(dataWithoutId);
      await doc.save();
      idMap[data.id] = doc._id; 
      return doc._id;
    };


    for (let i = 0; i < data.producers.length; i++) {
      const producerData = data.producers[i];
      const buyerData = data.buyers[i];
      const productData = data.paperProducts[i];

    
      await saveAndMap(Producer, producerData);
      await saveAndMap(Buyer, buyerData);
      await saveAndMap(PaperProduct, productData);


      const auctionData = data.auctions[i];
      const auctionId = await saveAndMap(Auction, {
        product_id: idMap[auctionData.product_id], 
        producer_id: idMap[auctionData.producer_id], 
        starting_price: auctionData.starting_price,
        auction_date: auctionData.auction_date,
        end_date: auctionData.end_date
      });

    
      const negotiationData = data.negotiations[i];
      await saveAndMap(Negotiation, {
        auction_id: auctionId, 
        buyer_id: idMap[negotiationData.buyer_id], 
        producer_id: idMap[negotiationData.producer_id], 
        final_price: negotiationData.final_price,
        negotiation_date: negotiationData.negotiation_date,
        delivery_date: negotiationData.delivery_date
      });

   
      const bidData = data.bids[i];
      await saveAndMap(Bid, {
        auction_id: auctionId, 
        buyer_id: idMap[bidData.buyer_id], 
        bid_amount: bidData.bid_amount,
        bid_date: bidData.bid_date
      });
    }

    console.log('População das coleções concluída!');
  } catch (error) {
    console.error('Erro ao popular:', error);
  }
}

module.exports = populateMongo;
