const mongoose = require('mongoose');

let ratingSchema = new mongoose.Schema({
    game_id: {type: String, required: true, unique: true},
    total_rating_value: {type: Number, required: true},
    number_of_players: {type: Number, required: true},
    number_of_ratings: {type: Number, required: true},

});

/* Creating the user model from the schema and giving it to Mongoose */
let RatingInfo = mongoose.model('RatingInfo', ratingSchema);

module.exports = RatingInfo;