const express = require('express')
let cookieParser = require('cookie-parser');
var cors = require('cors');
require('dotenv').config();

/* Routes */
let User = require('./routes/user.js');
let Games = require('./routes/games.js');
let Message = require('./routes/message.js')
let RatingInfo = require('./routes/ratingInfo');

const app = express(cors());

/* Parsers */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Access Headers */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, token, Origin, X-Requested-With, Content-Type, Accept, messageID");
    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

/* Routes */
app.use('/user', User);
app.use('/games', Games);
<<<<<<< HEAD
app.use('/message', Message);
=======
app.use('/ratingInfo', RatingInfo);
>>>>>>> 17bbc9fe273a81f44981a3823f894295b03474a4

app.get('/', (res, req) => {});

app.listen(process.env.PORT, () => {
    console.log('The application is running on localhost: ' + process.env.PORT)
});

module.exports = app;