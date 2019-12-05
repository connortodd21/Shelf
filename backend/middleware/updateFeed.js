let mongoose = require('mongoose');

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

const USER_RATED_GAME_FEED = (user, game, rating) => {
    return (user + ' has just rated the game \'' + game + '\' ' + rating + ' stars');
};

const USER_FOLLOWED_SOMEONE_ELSE_FEED = (follower, followee) => {
    return (follower + ' has just begun following \'' + followee + '\'');
};

const WISH_LIST_FEED = (user, game) => {
    return (user + ' has just added the game \'' + game + '\' to their wish list!');
};

const PLAYED_GAME_FEED = (user, game) => {
    return (user + 'has just played \'' + game + '\'!');
};

const addToFeed = function (user, event, hasGame, game, gameName) {
    if(hasGame){
        User.findOneAndUpdate({ username: user.username }, {
            $push: {
                feed: {
                    event: event,
                    user: user.username,
                    time_stamp: Date.now(),
                    userRatedGame: true,
                    game_id: game.game_id,
                    rating: game.rating,
                    gameName: gameName,
                }
            }
        }).catch(err => {
            console.log(err)
            return;
        })
    }
    else{
        User.findOneAndUpdate({ username: user.username }, {
            $push: {
                feed: {
                    event: event,
                    user: user.username,
                    time_stamp: Date.now()
                }
            }
        }).catch(err => {
            console.log(err)
            return;
        })
    }
}

const getCollectiveFeed = async function (user) {

    const getFeed = async (following) => {
        return Promise.all(following.map(element => {
            return Promise.resolve(getDetailedFeed(element))
        }))
    }

    const getDetailedFeed = async (username) => {
        return User.findOne({ username: username }).then(usr => {
            return Promise.all(usr.feed.map(element => {
                return Promise.resolve(element)
            }))
        })
    }

    const following = user.following;
    return getFeed(following).then(async (individualFeeds) => {
        return individualFeeds
    })
}

module.exports = { getCollectiveFeed, addToFeed, USER_FOLLOWED_SOMEONE_ELSE_FEED, USER_RATED_GAME_FEED, WISH_LIST_FEED, PLAYED_GAME_FEED };