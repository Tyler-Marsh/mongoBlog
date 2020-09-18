// import express
var express = require('express');
// import path module
const path = require('path');

// set up router
var router = express.Router()


/* HOME PAGE */
// newest version express users .get()/.post()
router.get('/', function(req, res, next) {
    res.render('index');
});

/* CONTACT PAGE */

/* GET 
router.get('/contact', function(req, res, next) {
    res.render('contact');
}); */

// DOESN'T WORK
/*
router.get("/examplepost", function(req, res, next) {
    res.render("examplepost");
})
*/
router.get("/search", function(req, res, next) {
    res.render("search");
})

// DOESN'T WORK
/* 
router.get("/post", function(req, res, next) {
    res.render("post");
}) */
// export in node.js
module.exports = router