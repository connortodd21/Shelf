var express = require('express');
var router = express.Router();
const axios = require('axios');
let mongoose = require('mongoose');
var authenticate = require('../middleware/authenticate')

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');
var Game = require('../model/game');

/**
 * All game related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all games and API related tasks');
});

/*
 * Get user data 
 */
router.get("/allgames", authenticate, async (req, res) => {

    const thing = await getGames();
    if (thing.data) {
        res.status(200).send(thing.data);
    } else {
        res.status(200).send({
            'Hello': 'Hello'
        })
    }
})

const getGames = async () => {

    const body = 'fields id,name,rating,url,cover.url;';

    try {
        return await axios.post('https://api-v3.igdb.com/games', body, {
            headers: {
                'user-key': '627c80f0f5bb9d77ae1a092ed94de20b'
            }
        })
    } catch (error) {
        console.error(error)
    }
}


module.exports = router;