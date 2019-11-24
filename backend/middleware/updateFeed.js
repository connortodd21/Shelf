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
    return (user + 'has just added the game \'' + game + '\' to their wish list!');
};

const PLAYED_GAME_FEED = (user, game) => {
    return (user + 'has just played \'' + game + '\'!');
};

const updateFeed = function(user, event) {

    const followers = user.followers
    followers.forEach(element => {
        User.findOneAndUpdate({username: element}, {
            $push: {
                feed: {
                    event: event,
                    user: user.username
                }
            }
        }).catch(err => {
            console.log(err)
            return;
        })
    })
}

module.exports = {updateFeed, USER_FOLLOWED_SOMEONE_ELSE_FEED, USER_RATED_GAME_FEED, WISH_LIST_FEED, PLAYED_GAME_FEED};