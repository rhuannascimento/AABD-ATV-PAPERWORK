const neo4j = require('neo4j-driver');
const fs = require('fs');
const connectNeo4j = require('./connectNeo4j.js');

async function populateNeo4j() {
  try {
    const driver = await connectNeo4j();
    const session = driver.session();

    // Carregar dados do arquivo JSON
    const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    // Inserir os dados no Neo4j
    for (let i = 0; i < data.producers.length; i++) {
      
      data.producers[i].contact_info = JSON.stringify(data.producers[i].contact_info);
      data.buyers[i].contact_info = JSON.stringify(data.buyers[i].contact_info); 

      const producerData = data.producers[i];
      const buyerData = data.buyers[i];
      const productData = data.paperProducts[i];
      const auctionData = data.auctions[i];
      const bidData = data.bids[i];
      const negotiationData = data.negotiations[i];

      // Criar produtores
      await session.run(
        `CREATE (p:Producer {id: $id, name: $name, location: $location, contact_info: $contact_info, production_capacity: $production_capacity, price_per_ton: $price_per_ton})`,
        producerData
      );

      // Criar compradores
      await session.run(
        `CREATE (b:Buyer {id: $id, name: $name, location: $location, contact_info: $contact_info, paper_demand: $paper_demand, budget: $budget})`,
        buyerData
      );

      // Criar produtos de papel
      await session.run(
        `CREATE (pp:PaperProduct {id: $id, product_name: $product_name, type: $type, weight_per_unit: $weight_per_unit, price_per_unit: $price_per_unit, quantity_available: $quantity_available})`,
        productData
      );

      // Criar leilões
      await session.run(
        `CREATE (a:Auction {id: $id, starting_price: $starting_price, auction_date: $auction_date, end_date: $end_date})`,
        auctionData
      );

      // Relacionar Produtor, Produto e Leilão
      await session.run(
        `MATCH (p:Producer {id: $producerId}), (pp:PaperProduct {id: $productId}), (a:Auction {id: $auctionId})
         CREATE (p)-[:OFFERS]->(a)-[:FOR_PRODUCT]->(pp)`,
        { producerId: producerData.id, productId: productData.id, auctionId: auctionData.id }
      );

      // Criar lances
      await session.run(
        `CREATE (b:Bid {id: $id, bid_amount: $bid_amount, bid_date: $bid_date})`,
        bidData
      );

      // Relacionar Comprador, Lance e Leilão
      await session.run(
        `MATCH (a:Auction {id: $auctionId}), (buyer:Buyer {id: $buyerId}), (b:Bid {id: $bidId})
         CREATE (buyer)-[:BIDS]->(b)-[:ON_AUCTION]->(a)`,
        { auctionId: auctionData.id, buyerId: buyerData.id, bidId: bidData.id }
      );

      // Criar negociações
      await session.run(
        `CREATE (n:Negotiation {id: $id, final_price: $final_price, negotiation_date: $negotiation_date, delivery_date: $delivery_date})`,
        negotiationData
      );

      // Relacionar Compra, Produtor, Negociação e Leilão
      await session.run(
        `MATCH (a:Auction {id: $auctionId}), (buyer:Buyer {id: $buyerId}), (producer:Producer {id: $producerId}), (n:Negotiation {id: $negotiationId})
         CREATE (buyer)-[:NEGOTIATES]->(n)-[:WITH_PRODUCER]->(producer)
         CREATE (n)-[:FROM_AUCTION]->(a)`,
        { auctionId: auctionData.id, buyerId: buyerData.id, producerId: producerData.id, negotiationId: negotiationData.id }
      );
    }

    console.log('População do banco Neo4j concluída!');
    await session.close();
    await driver.close();
  } catch (error) {
    console.error('Erro ao popular no Neo4j:', error);
  }
}

module.exports = populateNeo4j;

