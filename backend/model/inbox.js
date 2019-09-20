const mongoose = require('mongoose');

let InboxSchema = new mongoose.Schema({
  inbox: [{
    message: { type: String },
    sender: { type: String },
    time_stamp: { type: Date, default: Date.now() },
    isRead: { type: Boolean}
  }]
})

/* Creating the user model from the schema and giving it to Mongoose */
let Inbox = mongoose.model('inbox', InboxSchema);

module.exports = Inbox;