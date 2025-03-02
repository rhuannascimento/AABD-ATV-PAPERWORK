const mongoose = require('mongoose');
const connect = require('./connect.js');

async function create(){
  try {

    await connect();
    
    // Definindo cada coleção
    const ProducerSchema = new mongoose.Schema({
      name: String,
      location: String,
      contact_info: {
        phone: String,
        email: String
      },
      production_capacity: Number,
      price_per_ton: Number,
    });

    const BuyerSchema = new mongoose.Schema({
      name: String,
      location: String,
      contact_info: {
        phone: String,
        email: String
      },
      paper_demand: Number,
      budget: Number,
    });

    const PaperProductSchema = new mongoose.Schema({
      product_name: String,
      type: String,
      weight_per_unit: Number,
      price_per_unit: Number,
      quantity_available: Number,
    });

    const AuctionSchema = new mongoose.Schema({
      product_id: mongoose.Schema.Types.ObjectId,
      producer_id: mongoose.Schema.Types.ObjectId,
      starting_price: Number,
      auction_date: Date,
      end_date: Date,
    });

    const BidSchema = new mongoose.Schema({
      auction_id: mongoose.Schema.Types.ObjectId,
      buyer_id: mongoose.Schema.Types.ObjectId,
      bid_amount: Number,
      bid_date: { type: Date, default: Date.now }
    });

    const NegotiationSchema = new mongoose.Schema({
      auction_id: mongoose.Schema.Types.ObjectId,
      buyer_id: mongoose.Schema.Types.ObjectId,
      producer_id: mongoose.Schema.Types.ObjectId,
      final_price: Number,
      negotiation_date: Date,
      delivery_date: Date,
    });

    // Criando as coleções
    mongoose.model('Producer', ProducerSchema);
    mongoose.model('Buyer', BuyerSchema);
    mongoose.model('PaperProduct', PaperProductSchema);
    mongoose.model('Auction', AuctionSchema);
    mongoose.model('Bid', BidSchema);
    mongoose.model('Negotiation', NegotiationSchema);

    console.log('Estrutura do banco de dados criada com sucesso!');

  } catch (error) {
    console.error('Erro ao criar:', error);
  }
};

module.exports = create;