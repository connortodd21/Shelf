var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var authenticate = require('../middleware/authenticate');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('debug', false)

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


router.get('/:gameId', authenticate, async (req,res) => {

    RatingInfo.findOne({game_id: req.params.gameId}).then( ratingInfo => {

        res.status(200).send(ratingInfo);

    }).catch((err) => {
        res.status(500).send(err);
        return;
    })

});

router.post("/:gameId", authenticate, async (req, res) => {


    //not in db
    RatingInfo.findOne({game_id: req.params.gameId}).then(ratingInfo => {

        if (!ratingInfo) {
            var newRatingInfo = new RatingInfo({
                game_id: req.params.gameId,
                total_rating_value: 0,
                number_of_players: 0,
                number_of_ratings: 0
            });

            // Add to database with auth
            newRatingInfo.save().then(res => {
                if (req.body.oldRating === '0') {
                    console.log("TRYING LOOP");

                    RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                        $inc: {
                            number_of_ratings: 1,
                            total_rating_value: req.body.newRating
                        }


                    }).exec().then(usr => {
                        res.status(200).send({ message: req.body.gameId + " added to rated list!" })
                        return
                    }).catch((err) => {
                        res.status(500).send(err);
                        return
                    })

                }
                //user asking to delete rating
                else if (req.body.oldRating === req.body.newRating) {
                    RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                        $inc: {
                            number_of_ratings: -1,
                            total_rating_value: (-1*req.body.oldRating)
                        }
                    }).exec().then(usr => {
                        res.status(200).send({ message: req.body.gameId + " removed from rated list!" })
                        return
                    }).catch((err) => {
                        res.status(500).send(err);
                        return
                    })
                }
                else {
                    //previous rating
                    RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                        $inc: {
                            number_of_ratings: 0,
                            total_rating_value: (req.body.newRating - req.body.oldRating)
                        }
                    }).then(usr => {
                        res.status(200).send({ message: req.body.gameId + " updated to rated list!" })
                        return
                    }).catch((err) => {
                        res.status(500).send(err);
                        return
                    })
                }
            });
        }
        else {
            if (req.body.oldRating === '0') {
                console.log("TRYING LOOP");

                RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                    $inc: {
                        number_of_ratings: 1,
                        total_rating_value: req.body.newRating
                    }


                }).exec().then(usr => {
                    res.status(200).send({ message: req.body.gameId + " added to rated list!" })
                    return
                }).catch((err) => {
                    res.status(500).send(err);
                    return
                })

            }
            //user asking to delete rating
            else if (req.body.oldRating === req.body.newRating) {
                RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                    $inc: {
                        number_of_ratings: -1,
                        total_rating_value: (-1*req.body.oldRating)
                    }
                }).exec().then(usr => {
                    res.status(200).send({ message: req.body.gameId + " removed from rated list!" })
                    return
                }).catch((err) => {
                    res.status(500).send(err);
                    return
                })
            }
            else {
                //previous rating
                RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
                    $inc: {
                        number_of_ratings: 0,
                        total_rating_value: (req.body.newRating - req.body.oldRating)
                    }
                }).then(usr => {
                    res.status(200).send({ message: req.body.gameId + " updated to rated list!" })
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