var express = require('express');
var router = express.Router();
const axios = require('axios');
let mongoose = require('mongoose');

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage: storage });
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
var RatingInfo = require('../model/ratingInfo');

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
router.get("/criticallyacclaimedgames/:username", authenticate, async (req, res) => {
    const body = 'fields id,name,cover.image_id; where aggregated_rating > 95; limit 20; sort popularity desc;';

    let result = await axiosPost('https://api-v3.igdb.com/games', body);

    result = await appendGlobalRatingsToGames(result.data);
    result = await appendUserRatingsToGames(result, req.params.username);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send({ message: "There was an error retrieving game overview data" })
    }
})

/*
 * Get games from search query from the search page
 */
router.post("/searchedgames/:username", authenticate, async (req, res) => {
    const body = `fields id,name,cover.image_id; limit 50; search \"${req.body.search}\";`;
    const url = 'https://api-v3.igdb.com/games';

    // TODO MORGAN: SORT THE GAMES BY THEIR SHELF STAR RATING
    let result = await axiosPost(url, body);
    result = await appendGlobalRatingsToGames(result.data);
    result = await appendUserRatingsToGames(result, req.params.username);

    if (result) {
        res.status(200).send(result);
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

router.post("/addimage", async (req, res) => {
    console.log('Backend')
    if (!req.body.data) {
        res.status(400).send({ message: "Bad Request: Image data not provided" });
        return;
    }
    console.log('Adding the image');
});

router.post("/multiplegameoverviews/:username", authenticate, async (req, res) => {
    if (!req.body.gameIds) {
        res.status(400).send({ message: "Bad Request: IDs for games were not provided" });
        return;
    }

    const body = buildRequestBodyForMultipleGameOverviews(req.body.gameIds);
    const url = 'https://api-v3.igdb.com/games';

    let result = await axiosPost(url, body);
    result = await appendGlobalRatingsToGames(result.data);
    result = await appendUserRatingsToGames(result, req.params.username);

    if (result) {
        res.status(200).send(result);
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

appendGlobalRatingsToGames = async (games) => {

    let ratings = await getRatings();
    const map = new Map();

    for (let i = 0; i < ratings.length; i++) {
        map.set(ratings[i].game_id, ratings[i]._doc);
    }

    for (let i = 0; i < games.length; i++) {
        const key = games[i].id.toString();
        if (map.has(key)) {

            const ratingInfo = map.get(key);
            games[i].number_of_players = ratingInfo.number_of_players;
            games[i].number_of_ratings = ratingInfo.number_of_ratings;
            games[i].total_rating_value = ratingInfo.total_rating_value;
            if (ratingInfo.number_of_ratings === 0) {
                games[i].globalRating = 0;
            } else {
                games[i].globalRating = Math.floor(ratingInfo.total_rating_value / ratingInfo.number_of_ratings);
            }
        } else {
            games[i].number_of_players = 0;
            games[i].number_of_ratings = 0;
            games[i].total_rating_value = 0;
            games[i].globalRating = 0;
        }
    }

    return games;
}

getRatings = async () => {

    try {
        return await RatingInfo.find({})
    } catch (error) {
        console.error('There was an error in the getRatings method');
        return null;
    }

};

getUserRatings = async (username) => {
    try {
        return await User.findOne({ username: username })
    }
    catch (error) {
        console.error("There was an error in the getUserRatings method");
        return null;
    }
};

appendUserRatingsToGames = async (games, username) => {

    let user = await getUserRatings(username);
    const map = new Map();
    let ratings = user.games_rated;

    for (let i = 0; i < ratings.length; i++) {
        map.set(ratings[i]._doc.game_id, ratings[i]._doc.rating);
    }

    for (let i = 0; i < games.length; i++) {
        const key = games[i].id.toString();
        if (map.has(key)) {
            games[i].userRating = map.get(key);
        } else {
            games[i].userRating = 0;
        }
    }
    return games;
};


buildRequestBodyForMultipleGameOverviews = (gameIds) => {
    let body = `fields id,name,cover.image_id; where `;
    gameIds.forEach((id, i) => {
        if (i != 0) {
            body += ' | ';
        }
        body += `id = ${id}`;
    });
    body += ';';
    return body;
}

module.exports = router;