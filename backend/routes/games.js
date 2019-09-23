var express = require('express');
var router = express.Router();
const axios = require('axios');
let mongoose = require('mongoose');
var authenticate = require('../middleware/authenticate');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('debug', false);

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

// AND MAKE THE URLS IN A CONSTANTS FOLDER
/*
 * Get all games
 */
router.get("/criticallyacclaimedgames", authenticate, async (req, res) => {
    const body = 'fields id,name,cover.image_id; where aggregated_rating > 95; limit 20; sort popularity desc;';

    const result = await axiosPost('https://api-v3.igdb.com/games', body);
    if (result.data) {
        res.status(200).send(result.data);
    } else {
        res.status(400).send({ message: "There was an error retrieving game overview data" })
    }
})

/*
 * Get games from search query from the search page
 */
router.post("/searchedgames", authenticate, async (req, res) => {
    const body = `fields id,name,cover.image_id; limit 20; search \"${req.body.search}\";`;
    const url = 'https://api-v3.igdb.com/games';

    const result = await axiosPost(url, body);
    if (result.data) {
        res.status(200).send(result.data);
    } else {
        res.status(400).send({ message: "There was an error retrieving game data" })
    }
})

/*
 * Get detailed game data 
 */
router.post("/detailedgamedata", authenticate, async (req, res) => {
    
    if (!req.body.id) {
        res.status(400).send({ message: "Bad Request: ID for game was not provided" });
        return;
    }

    const body = `fields name,url,artworks.image_id,cover.image_id,first_release_date,genres.name,platforms.name,storyline; where id = ${req.body.id};`;
    const url = 'https://api-v3.igdb.com/games';

    const result = await axiosPost(url, body);
    if (result.data) {
        res.status(200).send(result.data);
    } else {
        res.status(400).send({ message: "There was an error retrieving detailed game data" })
    }

})

router.post("/multiplegameoverviews", authenticate, async (req, res) => {
    if (!req.body.gameIds) {
        res.status(400).send({ message: "Bad Request: IDs for games were not provided" });
        return;
    }

    const body = buildRequestBodyForMultipleGameOverviews(req.body.gameIds);
    const url = 'https://api-v3.igdb.com/games';

    const result = await axiosPost(url, body);
    if (result.data) {
        res.status(200).send(result.data);
    } else {
        res.status(400).send({ message: "There was an error retrieving detailed game data" })
    }

})

axiosPost = async (url, body) => {
    try {
        return await axios.post(url, body, {
            headers: {
                'user-key': process.env.API_KEY
            }
        })
    } catch (error) {
        console.error('There was an error in the axiosPost method');
        return null;
    }
}

buildRequestBodyForMultipleGameOverviews = (gameIds) => {
    let body = `fields id,name,cover.image_id; where `;
    gameIds.forEach((id, i) => {
        if (i != 0) {
            body += ' | ';
        }
        body += `id = ${id}`;
    });
    body += ';';
    console.log(body);
    return body;
}

module.exports = router;