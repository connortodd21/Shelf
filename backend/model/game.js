const mongoose = require('mongoose');

let gameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rating: { type: String },
})

/* Creating the user model from the schema and giving it to Mongoose */
let Game = mongoose.model('Game', gameSchema);

module.exports = Game;