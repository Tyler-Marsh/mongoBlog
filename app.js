var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index')
const port = process.env.PORT || 3000;

/* for mongodb connection */
const mongoose = require('mongoose');
// set up the app
var app = express();
// view engine setup

// used for setting up inlcudes in pug templating
app.locals.basedir = path.join(__dirname, 'views');
app.set('views', path.join(__dirname, 'views'));

// set up as pug

app.set('view engine', 'pug');


// set up static assets to be accessed
// from the public folder
// path.join __dirname == absolute path then public folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () =>  { 
  console.log(`This app is listening on port ${port}`)
});


/* CONNECT TO MONGOOSE */

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Successfully connected to MongoDB")
});


/* json to parse POST methods */
app.use(express.urlencoded({extended: false}));
// read incoming json
app.use(express.json());

/* ALL NON-GALLERY ROUTES */
app.use('/', indexRouter)


/* 404 BC used at end of stack */
app.use(function (req, res, next) {
  res.render('error');
});

