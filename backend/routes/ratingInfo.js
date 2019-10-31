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
var RatingInfo = require('../model/ratingInfo');

/**
 * All game related routes
 */
router.get("/", function (req, res) {
    res.status(200).send('This route is for all ratingInfo related tasks');
});


router.get('/all', authenticate, async (req, res) => {

    RatingInfo.find({}).then((ratingInfos) => {
        res.status(200).send(ratingInfos);
        return
    }).catch((err) => {
        res.status(500).send(err);
        return
    })

});

router.get('/:gameId', authenticate, async (req, res) => {


    RatingInfo.findOne({ game_id: req.params.gameId }).then(ratingInfo => {

        res.status(200).send(ratingInfo);

    }).catch((err) => {
        res.status(500).send(err);
        return;
    })

});

router.post("/add-comment", authenticate, (req, res) => {
    if (!req.body || !req.body.comment || !req.body.gameID) {
        res.status(400).send('Bad Request: add comment data is incomplete')
        return;
    }

    RatingInfo.findOne({ game_id: req.body.gameID }).then((game) => {
        if (game) {
            RatingInfo.findOneAndUpdate({ game_id: req.body.gameID }, {
                $push: {
                    comments: {
                        comment: req.body.comment,
                        username: req.user.username
                    }
                }
            }).then(() => {
                res.status(200).send({ message: "comment successfully added!" })
                return;
            }).catch(err => {
                res.status(500).send(err);
                return;
            })
        }
        else{
            var newRatingInfo = new RatingInfo({
                game_id: req.body.gameID,
                total_rating_value: 0,
                number_of_players: 0,
                number_of_ratings: 0
            });

            // Add to database with auth
            newRatingInfo.save().then(resp => {
                RatingInfo.findOneAndUpdate({ game_id: req.body.gameID }, {
                    $push: {
                        comments: {
                            comment: req.body.comment,
                            username: req.user.username
                        }
                    }
                }).then(() => {
                    res.status(200).send({ message: "comment successfully added!" })
                    return;
                }).catch(err => {
                    res.status(500).send(err);
                    return;
                })
            })
        }
    }).catch(err => {
        res.status(500).send(err);
        return;
    })
})

router.post("/delete-comment", authenticate, (req, res) => {
    if (!req.body || !req.body.commentID || !req.body.gameID) {
        res.status(400).send('Bad Request: delete comment data is incomplete')
        return;
    }

    RatingInfo.findOneAndUpdate({ game_id: req.body.gameID }, {
        $pull: {
            comments: {
                _id: req.body.commentID
            }
        }
    }).then(() => {
        res.status(200).send({ message: "comment successfully deleted!" })
        return;
    }).catch(err => {
        res.status(500).send(err);
        return;
    })
})

router.post("/upvote", authenticate, (req, res) => {
    if (!req.body || !req.body.commentID || !req.body.gameID) {
        res.status(400).send('Bad Request: upvote comment data is incomplete')
        return;
    }

    RatingInfo.findOne({ game_id: req.body.gameID }).then((game) => {
        const tempCommemts = game.comments
        for (let i = 0; i < tempCommemts.length; i++) {
            if (tempCommemts[i]._id == req.body.commentID) {
                tempCommemts[i].score++;
                break;
            }
        }
        RatingInfo.findOneAndUpdate({ game_id: req.body.gameID }, {
            $set: {
                comments: tempCommemts
            }
        }).then(() => {
            res.status(200).send({ message: "comment successfully upvoted!" })
            return;
        })
    }).catch(err => {
        res.status(500).send(err);
        return;
    })
})

router.post("/downvote", authenticate, (req, res) => {
    if (!req.body || !req.body.commentID || !req.body.gameID) {
        res.status(400).send('Bad Request: downvote comment data is incomplete')
        return;
    }

    RatingInfo.findOne({ game_id: req.body.gameID }).then((game) => {
        const tempCommemts = game.comments
        for (let i = 0; i < tempCommemts.length; i++) {
            if (tempCommemts[i]._id == req.body.commentID) {
                tempCommemts[i].score--;
                break;
            }
        }
        RatingInfo.findOneAndUpdate({ game_id: req.body.gameID }, {
            $set: {
                comments: tempCommemts
            }
        }).then(() => {
            res.status(200).send({ message: "comment successfully downvoted!" })
            return;
        })
    }).catch(err => {
        res.status(500).send(err);
        return;
    })
})

router.post("/:gameId", authenticate, async (req, res) => {

    console.log(req.body)

    //not in db
    RatingInfo.findOne({ game_id: req.params.gameId }).then(ratingInfo => {

        console.log(ratingInfo)

        if (!ratingInfo) {
            var newRatingInfo = new RatingInfo({
                game_id: req.params.gameId,
                total_rating_value: 0,
                number_of_players: 0,
                number_of_ratings: 0
            });

            // Add to database with auth
            newRatingInfo.save().then(resp => {
                if (req.body.oldRating === 0 || req.body.oldRating === '0') {
                    RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                        $inc: {
                            number_of_ratings: 1,
                            total_rating_value: req.body.newRating
                        }
                    }).exec().then(usr => {
                        res.status(200).send({
                            message: req.body.gameId + " added to ratingInfo list for first" +
                                " time!1"
                        })
                        return
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send(err);
                        return
                    })
                }
                //user asking to delete rating
                else if (req.body.oldRating === req.body.newRating) {
                    RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                        $inc: {
                            number_of_ratings: -1,
                            total_rating_value: (-1 * req.body.oldRating)
                        }
                    }).exec().then(usr => {
                        res.status(200).send({ message: req.body.gameId + " removed rating info1" })
                        return
                    }).catch((err) => {
                        res.status(500).send(err);
                        return
                    })
                }
                else {
                    //previous rating
                    RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                        $inc: {
                            number_of_ratings: 0,
                            total_rating_value: (req.body.newRating - req.body.oldRating)
                        }
                    }).then(usr => {
                        res.status(200).send({ message: req.body.gameId + " updated to previous rating info1" })
                        return
                    }).catch((err) => {
                        res.status(500).send(err);
                        return
                    })
                }
            });
        }
        else {
            if (req.body.oldRating === '0' || req.body.oldRating === 0) {
                RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                    $inc: {
                        number_of_ratings: 1,
                        total_rating_value: req.body.newRating
                    }
                }).exec().then(usr => {
                    res.status(200).send({ message: req.body.gameId + " added to rating info for first time2!" })
                    return
                }).catch((err) => {
                    res.status(500).send(err);
                    return
                })
            }
            //user asking to delete rating
            else if (req.body.oldRating === req.body.newRating) {
                RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                    $inc: {
                        number_of_ratings: -1,
                        total_rating_value: (-1 * req.body.oldRating)
                    }
                }).exec().then(usr => {
                    res.status(200).send({ message: req.body.gameId + " removed from rating info 2" })
                    return
                }).catch((err) => {
                    res.status(500).send(err);
                    return
                })
            }
            else {
                //previous rating
                RatingInfo.findOneAndUpdate({ game_id: req.params.gameId }, {
                    $inc: {
                        number_of_ratings: 0,
                        total_rating_value: (req.body.newRating - req.body.oldRating)
                    }
                }).then(usr => {
                    res.status(200).send({ message: req.body.gameId + " updated previous rating info 2" })
                    return
                }).catch((err) => {
                    res.status(500).send(err);
                    return
                })
            }
        }
    }).catch((err) => {
        res.status(500).send(err);
        return;
    });
});

module.exports = router;