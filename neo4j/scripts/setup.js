const create = require('./create');
const populate = require('./populate');


async function setup() {
    await create();
    await populate();
}

setup();