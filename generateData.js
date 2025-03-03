const fs = require('fs');

function generateRandomLocation() {
  const locations = ['Brasil', 'EUA', 'China', 'Alemanha', 'Argentina'];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateRandomContact() {
  return {
    phone: `+55 11 ${Math.floor(Math.random() * 1000000000)}`,
    email: `contato${Math.random().toString(36).substring(7)}@example.com`,
  };
}

function generateRandomCapacity(max = 2000) {
  return Math.floor(Math.random() * max);
}

function generateRandomPrice(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomDemand(max = 1000) {
  return Math.floor(Math.random() * max);
}

function generateRandomBudget(max = 100000) {
  return Math.floor(Math.random() * max);
}

function generateRandomProductType() {
    const products = ['A0', 'A1', 'A2', 'A3', 'A4'];
    return products[Math.floor(Math.random() * products.length)];
}

function generateRandomWeight() {
  return Math.random();
}

function generateRandomQuantity(max = 10000) {
  return Math.floor(Math.random() * max);
}

function generateRandomAuctionDate() {
  return new Date().toISOString();
}

function generateRandomEndDate() {
  return new Date(Date.now() + Math.random() * 86400000).toISOString();
}

function generateRandomBidAmount(max = 1000) {
  return Math.floor(Math.random() * max);
}

function generateRandomNegotiationPrice(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomDeliveryDate() {
  return new Date(Date.now() + 86400000).toISOString();
}

function createProducer(id) {
  return {
    id: `${id}-P`,
    name: `Produtora ${Math.random().toString(36).substring(7)}`,
    location: generateRandomLocation(),
    contact_info: generateRandomContact(),
    production_capacity: generateRandomCapacity(),
    price_per_ton: generateRandomPrice(),
  };
}

function createBuyer(id) {
  return {
    id: `${id}-B`,
    name: `Editora ${Math.random().toString(36).substring(7)}`,
    location: generateRandomLocation(),
    contact_info: generateRandomContact(),
    paper_demand: generateRandomDemand(),
    budget: generateRandomBudget(),
  };
}

function createPaperProduct(id) {
  return {
    id: `${id}-PP`,
    product_name: `Papel ${Math.random().toString(36).substring(7)}`,
    type: generateRandomProductType(),
    weight_per_unit: generateRandomWeight(),
    price_per_unit: generateRandomPrice(1, 10),
    quantity_available: generateRandomQuantity(),
  };
}

function createAuction(id, paperProducts, producers) {
  return {
    id: `${id}-A`,
    product_id: paperProducts[Math.floor(Math.random() * paperProducts.length)].id,
    producer_id: producers[Math.floor(Math.random() * producers.length)].id,
    starting_price: generateRandomPrice(),
    auction_date: generateRandomAuctionDate(),
    end_date: generateRandomEndDate(),
  };
}

function createBid(id, auctions, buyers) {
  return {
    id: `${id}-BI`,
    auction_id: auctions[Math.floor(Math.random() * auctions.length)].id,
    buyer_id: buyers[Math.floor(Math.random() * buyers.length)].id,
    bid_amount: generateRandomBidAmount(),
    bid_date: generateRandomAuctionDate(),
  };
}

function createNegotiation(id, auctions, buyers, producers) {
  return {
    id: `${id}-N`,
    auction_id: auctions[Math.floor(Math.random() * auctions.length)].id,
    buyer_id: buyers[Math.floor(Math.random() * buyers.length)].id,
    producer_id: producers[Math.floor(Math.random() * producers.length)].id,
    final_price: generateRandomNegotiationPrice(),
    negotiation_date: generateRandomAuctionDate(),
    delivery_date: generateRandomDeliveryDate(),
  };
}

function generateData() {
  const producers = [];
  const buyers = [];
  const paperProducts = [];
  const auctions = [];
  const bids = [];
  const negotiations = [];

  for (let i = 0; i < 200; i++) {
    producers.push(createProducer(i));
    buyers.push(createBuyer(i));
    paperProducts.push(createPaperProduct(i));
  }

  for (let i = 0; i < 200; i++) {
    auctions.push(createAuction(i, paperProducts, producers));
    bids.push(createBid(i, auctions, buyers));
    negotiations.push(createNegotiation(i, auctions, buyers, producers));
  }

  const data = { producers, buyers, paperProducts, auctions, bids, negotiations };
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('Arquivo data.json gerado com sucesso!');
}

generateData();
