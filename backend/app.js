const express = require('express')
var compression = require('compression')
let cookieParser = require('cookie-parser');
var cors = require('cors');
require('dotenv').config();
var app = express(cors());
app.use(compression({
    filter: function () { return true; },
    threshold: 1000
}));
/* Routes */
let User = require('./routes/user.js');
let Games = require('./routes/games.js');
let Message = require('./routes/message.js')
let RatingInfo = require('./routes/ratingInfo');
let Inbox = require('./routes/inbox')



/* Parsers */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Access Headers */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, token, Origin, X-Requested-With, Content-Type, Accept, receiver");
    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

/* Routes */
app.use('/user', User);
app.use('/games', Games);
app.use('/message', Message);
app.use('/ratingInfo', RatingInfo);
app.use('/inbox', Inbox)

app.get('/', (res, req) => {});

app.listen(process.env.PORT, () => {
    console.log('The application is running on localhost: ' + process.env.PORT)
});

module.exports = app;