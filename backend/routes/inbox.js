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
var Inbox = require('../model/inbox')

/**
 * All inbox related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all inbox related tasks');
});

router.get('/all-notifications', authenticate, (req, res) => {
    Inbox.findById(req.user.inboxID, (err, inbox) => {
        res.status(200).send(inbox);
        return;
    }).catch(err => {
        res.status(500).send(err);
        return;
    })
})

router.post('/add-notification', authenticate, (req, res) => {
    if (!req.body || !req.body.message || !req.body.receiver) {
        res.status(400).send('Bad Request: add to inbox data is incomplete')
        return;
    }

    User.findOne({username: req.body.receiver}).then( user => {

        if(!user) {
            res.status(404).send({ message: "Not Found: User does not exist" })
            return;
        }

        Inbox.findByIdAndUpdate({ _id: user.inboxID }, {
            $push: {
                notification: {
                    message: req.body.message,
                    sender: req.user.username,
                }
            }
        }).then(() => {
            res.status(200).send({ message: 'Notification sent!' });
            return;
        }).catch(err => {
            res.status(500).send(err);
            return;
        })
    })

})

router.post('/delete-notification', authenticate, (req, res) => {
    if (!req.body || !req.body.notificationID) {
        res.status(400).send('Bad Request: delete notification data is incomplete')
        return;
    }
    Inbox.findByIdAndUpdate({ _id: req.user.inboxID }, {
        $pull: {
            notification: {
                _id: req.body.notificationID
            }
        }
    }).then(() => {
        res.status(200).send({ message: 'Notification successfully deleted' })
        return;
    }).catch((err) => {
        res.status(500).send(err);
        return;
    })
})

router.post('/mark-as-read', authenticate, (req, res) => {
    if (!req.body || !req.body.notificationID) {
        res.status(400).send('Bad Request: mark as read data is incomplete')
        return;
    }

    Inbox.findById(req.user.inboxID).then(inbox => {
        let i = 0;
        for (i = 0; i < inbox.notifications.length; i++) {
            if (inbox.notifications[i]._id == req.body.notificationID) {
                inbox.notifications[i].hasBeenRead = true
                break;
            }
        }
        var temp = com.comments
        Inbox.findByIdAndUpdate({ _id: req.user.inboxID }, {
            $set: {
                'notifications': temp
            }
        }).then(() => {
            res.status(200).send({ message: 'Notification successfully marked as read' })
            return;
        })
    }).catch((err) => {
        res.status(500).send(err);
        return;
    })
})

module.exports = router;