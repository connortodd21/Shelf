var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var authenticate = require('../middleware/authenticate');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('debug', false);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');
var Message = require('../model/message')

/**
 * All game related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all games and API related tasks');
});

router.get('/all', authenticate, (req, res) => {
    if (!req.headers.receiver) {
        res.status(400).send({ message: 'Bad Request: missing messageid header' })
        return
    }

    Message.findOne({
        $or: [
            { $and: [{ firstUser: req.user.username }, { secondUser: req.headers.receiver }] },
            { $and: [{ firstUser: req.headers.receiver }, { secondUser: req.user.username }] }]
    }).then(msg => {
        // console.log(msg)
        res.status(200).send(msg)
        return;
    }).catch(err => {
        res.status(500).send(err);
        return;
    })

})

router.post('/new', authenticate, (req, res) => {
    if (!req.body || !req.body.firstUser || !req.body.secondUser) {
        res.status(400).send({ message: "Bad Request: new message data is incomplete" })
        return
    }

    User.findOne({ username: req.body.firstUser }).then((firstUser) => {
        if (!firstUser) {
            res.status(401).send({ message: "User does not exist" })
            return
        }
        User.findOne({ username: req.body.secondUser }).then((secondUser) => {
            if (!secondUser) {
                res.status(401).send({ message: "User does not exist" })
                return
            }

            Message.findOne({
                $or: [
                    { $and: [{ firstUser: req.body.firstUser }, { secondUser: req.body.secondUser }] },
                    { $and: [{ firstUser: req.body.secondUser }, { secondUser: req.body.firstUser }] }]
            }).then(msg => {
                if (!msg) {
                    var newMessage = new Message({
                        firstUser: req.body.firstUser,
                        secondUser: req.body.secondUser
                    })

                    newMessage.save().then(() => {
                        res.status(200).send(newMessage);
                        return;
                    }).catch((err) => {
                        res.status(500).send(err)
                        return;
                    })
                }
                else {
                    res.status(409).send({ message: "Conflict: Message already exists" })
                    return
                }
            })

        })
    })

})

router.post('/send', authenticate, (req, res) => {
    if (!req.body || !req.body.message || !req.body.messageID) {
        res.status(400).send({ message: "Bad Request: send message data is incomplete" })
        return
    }

    Message.findById(req.body.messageID, (err, resp) => {
        if (err) {
            res.status(404).send({ message: 'Message object does not exist' })
            return;
        }
        else {
            Message.findOneAndUpdate({ _id: req.body.messageID }, {
                $push: {
                    messages: {
                        message: req.body.message,
                        sender: req.user.username,
                    }
                }
            }).then(msg => {
                res.status(200).send({ message: "Message " + req.body.message + " sent "})
                return;
            }).catch(err => {
                res.status(500).send(err)
                return;
            })
        }
    }).catch(err => {
        res.status(500).send(err)
        return;
    })
})

module.exports = router;