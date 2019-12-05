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
  games_rated: [{
    game_id: { type: String },
    rating: { type: Number },
    coverUrl: { type: String },
  }],
  favorites: { type: [String] },
  followers: { type: [String] },
  following: { type: [String] },
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
  inboxID: { type: String },
  verificationNum: { type: String},
  verified: { type: Boolean, default: false },
  messages: { type: [String] },
  feed: [{
    event: { type: String },
    time_stamp: { type: Date, default: Date.now() },
    user: { type: String },
  }]
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

userSchema.statics.findVerificationNumByEmail = function (email) {
  var User = this;

  return User.findOne({ email }).then((user) => {
    if (!user || !user.verificationNum) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user.verificationNum);
    }
  });
};

userSchema.statics.findByEmail = function(email) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (user == null || !user.email) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user);
    }
  });
};

/* Function to prevent too much information from being returned on request when the response is the object */
userSchema.methods.toJSON = function () {
  return ld.pick(this.toObject(), ['_id', 'username', 'email', 'birthday', 'games_played', 'games_rated', 'favorites', 'followers', 'following', 'inbox', 'wish_list', 'date_created', 'inboxID', 'verificationNum'])
}

/* Creating the user model from the schema and giving it to Mongoose */
let User = mongoose.model('User', userSchema);

module.exports = User;