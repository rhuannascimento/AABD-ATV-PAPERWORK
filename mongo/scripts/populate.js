const connect = require('./connect.js');
const mongoose = require('mongoose');

async function populate() {
  try {
    
    await connect();

    // Modelos
    const Producer = mongoose.model('Producer');
    const Buyer = mongoose.model('Buyer');
    const PaperProduct = mongoose.model('PaperProduct');
    const Auction = mongoose.model('Auction');
    const Bid = mongoose.model('Bid');
    const Negotiation = mongoose.model('Negotiation');

    // Gerar dados aleatórios
    const generateRandomData = () => {
      const randomLocation = ['Brasil', 'EUA', 'China', 'Alemanha', 'Argentina'];
      const randomContact = () => ({
        phone: `+55 11 ${Math.floor(Math.random() * 1000000000)}`,
        email: `contato${Math.random().toString(36).substring(7)}@example.com`,
      });

      return {
        Producer: {
          name: `Produtora ${Math.random().toString(36).substring(7)}`,
          location: randomLocation[Math.floor(Math.random() * randomLocation.length)],
          contact_info: randomContact(),
          production_capacity: Math.floor(Math.random() * 2000),
          price_per_ton: Math.floor(Math.random() * 1000) + 100,
        },
        Buyer: {
          name: `Editora ${Math.random().toString(36).substring(7)}`,
          location: randomLocation[Math.floor(Math.random() * randomLocation.length)],
          contact_info: randomContact(),
          paper_demand: Math.floor(Math.random() * 1000),
          budget: Math.floor(Math.random() * 100000),
        },
        PaperProduct: {
          product_name: `Papel ${Math.random().toString(36).substring(7)}`,
          type: 'Papel',
          weight_per_unit: 0.1,
          price_per_unit: Math.floor(Math.random() * 10) + 1,
          quantity_available: Math.floor(Math.random() * 10000),
        },
        Auction: (producer_id, product_id) => ({
          product_id,
          producer_id,
          starting_price: Math.floor(Math.random() * 1000) + 100,
          auction_date: new Date(),
          end_date: new Date(Date.now() + Math.random()),
        }),
        Negotiation: (auction_id, buyer_id, producer_id) => ({
          auction_id,
          buyer_id,
          producer_id,
          final_price: Math.floor(Math.random() * 1000) + 100,
          negotiation_date: new Date(),
          delivery_date: new Date(Date.now() + 86400000),
        }),
        Bid: (auction_id, buyer_id) => ({
          auction_id,
          buyer_id,
          bid_amount: Math.floor(Math.random() * 1000),
          bid_date: new Date(Date.now() + Math.random()),
        }),
      };
    };

    // Buscar id aleatorio
    const getRandomId = async (Model) => {
      const randomDoc = await Model.aggregate([{ $sample: { size: 1 } }]);
      return randomDoc.length > 0 ? randomDoc[0]._id : null;
    };

    // Inserir dados nas coleções
    const insertData = async () => {
    
      for (let i = 0; i < 200; i++) {
        const producerData = generateRandomData().Producer;
        const buyerData = generateRandomData().Buyer;
        const productData = generateRandomData().PaperProduct;
 
        const producer = new Producer(producerData);
        const buyer = new Buyer(buyerData);
        const paperProduct = new PaperProduct(productData);

        await producer.save();
        await buyer.save();
        await paperProduct.save();  
        
        const producerRandomId = await getRandomId(Producer);
        const paperProductRandomId = await getRandomId(PaperProduct);
        const auctionRandomId = await getRandomId(Auction);
        const buyerRandomId = await getRandomId(Buyer);

        
        const auction = new Auction(generateRandomData().Auction(producerRandomId, paperProductRandomId));
        await auction.save();
        const negotiation = new Negotiation(generateRandomData().Negotiation(auctionRandomId, buyerRandomId, producerRandomId));
        await negotiation.save();
        const bid = new Bid(generateRandomData().Bid(auctionRandomId, buyerRandomId));
        await bid.save();
      }


      console.log('População das coleções concluída!');
    };

    await insertData();

  } catch (error) {
    console.error('Erro ao popular:', error);
  }
};

module.exports = populate;
