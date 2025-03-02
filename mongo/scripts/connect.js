const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar:', error);
    }
}

module.exports = connect;