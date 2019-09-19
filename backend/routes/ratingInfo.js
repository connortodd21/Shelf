var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var authenticate = require('../middleware/authenticate');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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

    console.log("helo")
    RatingInfo.findOneAndUpdate({game_id: req.params.gameId}, {
        $inc: {
            number_of_ratings: 1,
            total_rating_value: req.body.rating
        }
    }, () => {
        console.log("inside");
        res.status(200).send({ message:"Rating updated successfully" });
        return
    }).catch((err) => {
        res.status(500).send(err);
        return
    })

});

module.exports = router;