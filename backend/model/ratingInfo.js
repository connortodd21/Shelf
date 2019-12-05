const mongoose = require('mongoose');

let ratingSchema = new mongoose.Schema({
  game_id: {type: String, unique: true},
  total_rating_value: {type: Number},
  number_of_players: {type: Number},
  number_of_ratings: {type: Number},
  userRating: {type: Number},
  comments: [{
    comment: { type: String },
    username: { type: String },
    time_stamp: { type: Date, default: Date.now() },
    score: { type: Number, default: 0 }
  }],
  images: [{
    url: String,
    id: String
  }]
});

/* Creating the user model from the schema and giving it to Mongoose */
let RatingInfo = mongoose.model('RatingInfo', ratingSchema);

module.exports = RatingInfo;