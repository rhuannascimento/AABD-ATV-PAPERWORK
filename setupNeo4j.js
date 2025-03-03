const createNeo4j = require('./createNeo4j');
const populateNeo4j = require('./populateNeo4j');


async function setupNeo4j() {
    await createNeo4j();
    await populateNeo4j();
}

setupNeo4j();