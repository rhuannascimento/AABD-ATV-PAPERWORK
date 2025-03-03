const neo4j = require('neo4j-driver');
const connect = require('./connect.js');

async function populate() {
  try {
    const driver = await connect();
    const session = driver.session();

    // Gerar dados aleatórios
    const generateRandomData = () => {
      const randomLocation = ['Brasil', 'EUA', 'China', 'Alemanha', 'Argentina'];
      const randomContact = () => ({
        phone: `+55 11 ${Math.floor(Math.random() * 1000000000)}`,
        email: `contato${Math.random().toString(36).substring(7)}@example.com`,
      });
      
      return {
        Producer: {
          id: Math.random().toString(36).substring(7),
          name: `Produtora ${Math.random().toString(36).substring(7)}`,
          location: randomLocation[Math.floor(Math.random() * randomLocation.length)],
          contact_info: JSON.stringify(randomContact()),
          production_capacity: Math.floor(Math.random() * 2000),
          price_per_ton: Math.floor(Math.random() * 1000) + 100,
        },
        Buyer: {
          id: Math.random().toString(36).substring(7),
          name: `Editora ${Math.random().toString(36).substring(7)}`,
          location: randomLocation[Math.floor(Math.random() * randomLocation.length)],
          contact_info: JSON.stringify(randomContact()),
          paper_demand: Math.floor(Math.random() * 1000),
          budget: Math.floor(Math.random() * 100000),
        },
        PaperProduct: {
          id: Math.random().toString(36).substring(7),
          product_name: `Papel ${Math.random().toString(36).substring(7)}`,
          type: 'Papel',
          weight_per_unit: 0.1,
          price_per_unit: Math.floor(Math.random() * 10) + 1,
          quantity_available: Math.floor(Math.random() * 10000),
        },
        Auction: {
          id: Math.random().toString(36).substring(7),
          starting_price: Math.floor(Math.random() * 1000) + 100,
          auction_date: new Date().toISOString(),
          end_date: new Date(Date.now() + Math.random() * 86400000).toISOString(),
        },
        Bid: {
          id: Math.random().toString(36).substring(7),
          bid_amount: Math.floor(Math.random() * 1000),
          bid_date: new Date().toISOString(),
        },
        Negotiation: {
          id: Math.random().toString(36).substring(7),
          final_price: Math.floor(Math.random() * 1000) + 100,
          negotiation_date: new Date().toISOString(),
          delivery_date: new Date(Date.now() + 86400000).toISOString(),
        },
      };
    };

    // Inserir dados
    for (let i = 0; i < 200; i++) {
      const producerData = generateRandomData().Producer;
      const buyerData = generateRandomData().Buyer;
      const productData = generateRandomData().PaperProduct;

      await session.run(
        `CREATE (p:Producer {id: $id, name: $name, location: $location, contact_info: $contact_info, production_capacity: $production_capacity, price_per_ton: $price_per_ton})`,
        producerData
      );

      await session.run(
        `CREATE (b:Buyer {id: $id, name: $name, location: $location, contact_info: $contact_info, paper_demand: $paper_demand, budget: $budget})`,
        buyerData
      );

      await session.run(
        `CREATE (pp:PaperProduct {id: $id, product_name: $product_name, type: $type, weight_per_unit: $weight_per_unit, price_per_unit: $price_per_unit, quantity_available: $quantity_available})`,
        productData
      );

      const auctionData = generateRandomData().Auction;
      await session.run(
        `CREATE (a:Auction {id: $id, starting_price: $starting_price, auction_date: $auction_date, end_date: $end_date})`,
        auctionData
      );

      await session.run(
        `MATCH (p:Producer {id: $producerId}), (pp:PaperProduct {id: $productId}), (a:Auction {id: $auctionId})
         CREATE (p)-[:OFFERS]->(a)-[:FOR_PRODUCT]->(pp)`,
        { producerId: producerData.id, productId: productData.id, auctionId: auctionData.id }
      );
      
      const bidData = generateRandomData().Bid;
      await session.run(
        `CREATE (b:Bid {id: $id, bid_amount: $bid_amount, bid_date: $bid_date})`,
        bidData
      );
      
      await session.run(
        `MATCH (a:Auction {id: $auctionId}), (buyer:Buyer {id: $buyerId}), (b:Bid {id: $bidId})
         CREATE (buyer)-[:BIDS]->(b)-[:ON_AUCTION]->(a)`,
        { auctionId: auctionData.id, buyerId: buyerData.id, bidId: bidData.id }
      );
      
      const negotiationData = generateRandomData().Negotiation;
      await session.run(
        `CREATE (n:Negotiation {id: $id, final_price: $final_price, negotiation_date: $negotiation_date, delivery_date: $delivery_date})`,
        negotiationData
      );
      
      await session.run(
        `MATCH (a:Auction {id: $auctionId}), (buyer:Buyer {id: $buyerId}), (producer:Producer {id: $producerId}), (n:Negotiation {id: $negotiationId})
         CREATE (buyer)-[:NEGOTIATES]->(n)-[:WITH_PRODUCER]->(producer)
         CREATE (n)-[:FROM_AUCTION]->(a)`,
        { auctionId: auctionData.id, buyerId: buyerData.id, producerId: producerData.id, negotiationId: negotiationData.id }
      );
    }

    console.log('População do banco de dados concluída!');
    await session.close();
    await driver.close();
  } catch (error) {
    console.error('Erro ao popular:', error);
  }
}

module.exports = populate;
