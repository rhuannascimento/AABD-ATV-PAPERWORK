const neo4j = require('neo4j-driver');
const connectNeo4j = require('./connectNeo4j.js');

async function createNeo4j() {
  const driver = connectNeo4j(); // Conectar ao Neo4j
  const session = driver.session();

  try {
    // Lista de comandos para criar restrições individualmente
    const constraints = [
      "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Producer) REQUIRE p.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (b:Buyer) REQUIRE b.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (pp:PaperProduct) REQUIRE pp.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Auction) REQUIRE a.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (bid:Bid) REQUIRE bid.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Negotiation) REQUIRE n.id IS UNIQUE"
    ];

    for (const query of constraints) {
      await session.run(query);
    }

    console.log('Estrutura do banco de dados criada com sucesso no Neo4j!');
  } catch (error) {
    console.error('Erro ao criar estrutura no Neo4j:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = createNeo4j;