// import express
var express = require('express');
// import path module
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
// set up router
var router = express.Router()
//const apostPath =  path.join(__dirname, "../views/apost.ejs");

let clientPostsPath = path.join(__dirname, "../views/_client_posts.ejs");
/* HOME PAGE */
// newest version express users .get()/.post()
// get posts from database
router.get('/', async function(req, res, next) {
    try {
        // just 10 posts and descending date
        // populate finds data associated with "user" schema
        // "username" is the only associated name chosen
        posts = await Post.find().populate("user", "username").limit(10).sort({ 'date': 'descending' })
        // pass posts in index to show
        res.render('index', {posts: posts, path: clientPostsPath});
    }   catch(err) {
        console.log(err);
        next(err);
    }
});

router.get(["/search" , "/search/:searchTerm"],  async function(req, res, next) {
    if (req.query.searchTerm) {
        const searchTerm = req.query.searchTerm;
        try {
            const posts = await Post.find({ title: { $regex: '.*' + searchTerm}}).limit(5);
        res.render("searchPosts", {posts: posts, path: clientPostsPath});      
        } catch(err) {
            console.log("/search ERROR !!!!", err);
            next(err);
        }
        
    } else {
        res.render("searchTitle");
    }
});

module.exports = router