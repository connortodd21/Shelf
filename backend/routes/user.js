var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var hash = require('../middleware/hash')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')

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
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all user related tasks');
});

/**
 * Get All Users
 */
router.get("/all-users", authenticate, (req, res) => {

    User.find({}).then((users) => {
        res.status(200).send(users);
        return
    }).catch((err) => {
        res.status(500).send(err);
        return
    })

})

/*
 * Register new user 
 */
router.post("/register", (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.username || !req.body.birthday) {
        console.log(req.body)
        res.status(400).send({ message: "Bad Request: Register user data is incomplete" });
        return;
    }

    hash(req.body.password).then((password) => {

        var inbox = new Inbox()

        // User Data
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: password,
            birthday: req.body.birthday,
            inboxID: inbox._id
        });

        // Add to database with auth
        newUser.save().then(() => {
            return newUser.generateAuth().then((token) => {
                res.status(200).send(newUser);
                return
            });
        }).catch((err) => {
            if (err.code == 11000) {
                if (err.errmsg.includes("email", 0)) {
                    res.status(409).send({ message: "Conflict: Email already exists" })
                    return
                }
                res.status(409).send({ message: "Conflict: User already exists" })
                return
            }
            res.status(500).send(err)
            return;
        })
    }).catch(err => {
        res.status(500).send(err)
    })
});

/*
 * Login 
 */
router.post('/login', (req, res) => {

    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "Bad request: Login user data is incomplete" })
        return;
    }

    User.findOne({ username: req.body.username }).then(user => {

        if (!user) {
            res.status(404).send({ message: "Not Found: User does not exist" })
            return;
        }

        bcrypt.compare(req.body.password, user.password, (err, comp) => {
            if (comp == false) {
                res.status(401).send({ message: "Unauthorized: Password is incorrect" })
                return
            }

            user.generateAuth().then(token => {
                res.status(200).header('token', token).send(user)
                return
            })
        })
    }).catch((err) => {
        res.status(500).send(err)
        return
    })
})

/*
 * Logout
 */
router.post('/logout', authenticate, (req, res) => {

    if (!req.body.username) {
        res.status(400).send({ message: "Bad request: Logout user data is incomplete" })
        return;
    }

    User.findOneAndUpdate({ username: req.body.username }, {
        $set: {
            tokens: []
        }
    }, () => {
        res.status(200).send({ message: "User \'" + req.body.username + "\' successfully logged out" })
        return
    }).catch((err) => {
        res.status(500).send(err)
        return
    })
})

router.post('/add-friend', authenticate, (req, res) => {
    if (!req.body || !req.body.friend) {
        res.status(400).send({ message: "Bad request: Add friend data is incomplete" })
        return;
    }

    if(req.body.friend === req.user.username) {
        res.status(400).send({ message: "Bad request: you can't add yourself as a friend" })
        return;
    }

    User.findById(req.user._id, (err, user) => {
        if (err) {
            res.status(401).send({ message: "User does not exist" })
            return
        }

        User.findByIdAndUpdate(user._id, {
            $push: {
                friends: req.body.friend
            }
        }).then(usr => {
            res.status(200).send({ message: req.body.friend + " added to friends list!" })
            return
        }).catch((err) => {
            res.status(500).send(err)
            return
        })
    }).catch((err) => {
        res.status(500).send(err)
        return
    })
})

router.post('/remove-friend', authenticate, (req, res) => {
    if (!req.body || !req.body.friend) {
        res.status(400).send({ message: "Bad request: Add friend data is incomplete" })
        return;
    }

    if(req.body.friend === req.user.username) {
        res.status(400).send({ message: "Bad request: you can't remove yourself as a friend" })
        return;
    }

    User.findById(req.user._id, (err, user) => {
        if (err) {
            res.status(401).send({ message: "User does not exist" })
            return
        }

        User.findByIdAndUpdate(user._id, {
            $pull: {
                friends: req.body.friend
            }
        }).then(usr => {
            res.status(200).send({ message: req.body.friend + " deleted from friends list!" })
            return
        }).catch((err) => {
            res.status(500).send(err)
            return
        })
    }).catch((err) => {
        res.status(500).send(err)
        return
    })
})

/*
 * Get user data 
 */
router.post("/data", authenticate, (req, res) => {
    if (!req.body || !req.body.username) {
        res.status(400).send({ message: "Bad request: get user data data is incomplete" })
        return;
    }

    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            res.status(401).send({ message: "User does not exist" })
            return
        }
        res.status(200).send(user)
        return
    }).catch((err) => {
        res.status(500).send(err)
        return
    })
})


module.exports = router;
