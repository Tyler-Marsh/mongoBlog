var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');


/* for mongodb connection */
const mongoose = require('mongoose');

// log requests to gitbash

const morgan = require('morgan');

const port = process.env.PORT || 3000;

// set up the app
var app = express();
app.use(expressLayouts);
// Parse cookies :)
app.use(cookieParser());
// in development log request made
app.use(morgan('dev'));
// view engine setup

// used for setting up inlcudes in pug templating
app.locals.basedir = path.join(__dirname, 'views');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set up as pug

//app.set('view engine', 'ejs');


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
// comes before using routers
app.use(express.urlencoded({extended: false}));
// read incoming json
app.use(express.json());

/* ALL NON-GALLERY ROUTES */
app.use('/', indexRouter);

app.use('/admin', adminRouter);


/* 404 BC used at end of stack */
app.use(function (req, res, next) {
  res.render('error');
});

