const neo4j = require('neo4j-driver');
require('dotenv').config();

function connectNeo4j() {
    try {
        const driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );
        console.log('Conectado ao Neo4j');
        return driver;
    } catch (error) {
        console.error('Erro ao conectar:', error);
    }
}

module.exports = connectNeo4j;