const createMongo = require('./createMongo');
const populateMongo = require('./populateMongo');


async function setupMongo() {
    await createMongo();
    await populateMongo();
}

setupMongo();