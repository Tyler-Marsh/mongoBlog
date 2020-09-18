
var express = require('express');
// import path module
const path = require('path');
// set up router
const bcryptjs = require('bcryptjs');
const cookieParser = require('cookie-parser');
//const mongoose = require('mongoose');
var crypto = require('crypto');
const checkSession = require('../middleware/checkSession');


/* generates session ID */
var generate_key = function() {
  // 16 bytes is likely to be more than enough,
  // but you may tweak it to your needs
  return crypto.randomBytes(16).toString('base64');
};

const User = require('../models/User');

var router = express.Router()

// RELATIVE PATH WORKS FOR VIEWS
// SEPARATE ADMIN ROUTING
router.get("/login", function(req, res, next) {
  console.log(req.cookies)
  res.render("admin/admin-login", { layout: 'admin/adminlayout.ejs'})
})

// check database for login
// make middleware to implement in all protected routes
// IMPLEMENT CHECK SESSION so logged in users can skip this page
//
router.post("/login", async function(req, res, next ) {
    let user;
    try {
    let user = await User.findOne({ username: req.body.adminName })
    
    // If user isn't found redirect
      if (!user) {
        //  "/" is to home page of site
        // relative path is for router.post('/login')
        res.redirect("/");
      } else {
        if (bcryptjs.compareSync(req.body.secretword, user.password)) {
          /*  IF PASSWORDS MATCH DO THE FOLLOWING      */

          // set a cookie for the username
          res.cookie("username", req.body.adminName);
          // generate a session ID
          sessionKey = generate_key();
          // save session ID in mongoDB
          user.session_id = sessionKey;
          await user.save();
          // set a cookie for the session ID
          res.cookie("session_id", sessionKey);
        
          /* FINALLY REDIRECT */
          res.redirect("/admin/dashboard");
        } else {
          // if password doesn't match redirect to site home page
          res.redirect("/");
        }
      }
    } catch(err) {
      console.log("ERROR @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", err);
      res.redirect("/admin/login");
  }
});

  // send to admin/dashboard
  router.get('/dashboard', checkSession, function(req, res, next) {
    if (req.auth) {
      res.render("admin/admin-dashboard", { layout: 'admin/adminlayout.ejs'});
    } else {
      res.redirect('/');
    }
  });

  router.get('/dashboard/logout', checkSession, function(req, res, next) {
    if (req.auth) {
    try {
    res.clearCookie('username');
    res.clearCookie('session_id');
    } catch(err) {
      console.log(err);
    }
    res.redirect('/');
  }
  res.redirect('/');
  })

  router.get('/dashboard/create', checkSession, function(req, res, next) {
      if (req.auth) {
        res.render("admin/admin-dashboard-create", { layout: 'admin/adminlayout.ejs'})
      }
  })

module.exports = router;