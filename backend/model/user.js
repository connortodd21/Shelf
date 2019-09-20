const mongoose = require('mongoose');
const vdator = require('validator');
const jwt = require('jsonwebtoken');
const ld = require('lodash');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 6, trim: true },
  password: { type: String, required: true, minlength: 8 },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: vdator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  birthday: { type: Date },
  games_played: { type: [String] },
  games_rated: { type: [String] },
  favorites: { type: [String] }, 
  followers: { type: [String] },
  following: { type: [String] },
  inbox: { type: [String] },
  wish_list: { type: [String] },
  date_created: { type: Date, default: Date.now() },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: [{
      type: String,
      require: true
    }]
  }],
  inboxID: { type: String }
})

/* Generate authentication token for user */
userSchema.methods.generateAuth = function () {
    var user = this
    var access = 'auth'

    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, { expiresIn: "10h" }).toString()
    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => {
      return token
    })
}

/* Find a user bu their authentication token */
userSchema.statics.findByToken = function (token) {
    var User = this
    var decodedTokenObj;
  
    try {
      decodedTokenObj = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Promise.reject();
    }
  
    return User.findOne({
      _id: decodedTokenObj._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  }

/* Function to prevent too much information from being returned on request when the response is the object */
userSchema.methods.toJSON = function () {
  return ld.pick(this.toObject(), ['_id', 'username', 'email', 'birthday', 'games_played', 'games_rated', 'favorites', 'followers', 'following' , 'inbox', 'wish_list', 'date_created', 'inboxID'])
}

/* Creating the user model from the schema and giving it to Mongoose */
let User = mongoose.model('User', userSchema);

module.exports = User;