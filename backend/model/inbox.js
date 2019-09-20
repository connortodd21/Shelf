const mongoose = require('mongoose');

let InboxSchema = new mongoose.Schema({
  notification: [{
    message: { type: String },
    sender: { type: String },
    time_stamp: { type: Date, default: Date.now() },
    hasBeenRead: { type: Boolean, default: false}
  }]
})

/* Creating the user model from the schema and giving it to Mongoose */
let Inbox = mongoose.model('inbox', InboxSchema);

module.exports = Inbox;