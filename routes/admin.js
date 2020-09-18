
var express = require('express');
// import path module
const path = require('path');
// set up router
const bcryptjs = require('bcryptjs');

//const mongoose = require('mongoose');

const User = require('../models/User');

var router = express.Router()

// RELATIVE PATH WORKS FOR VIEWS
// SEPARATE ADMIN ROUTING
router.get("/login", function(req, res, next) {
  res.render("admin/admin-login", { layout: 'admin/adminlayout.ejs'})
})

// check database for login
// make middleware to implement in all protected routes
router.post("/login", async function(req, res, next ) {
  let user;
  try {
   let user = await User.findOne({ username: req.body.adminName })
   console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@", user);
    if (!user) {
      res.redirect("/admin/login");
    } else {
      console.log("are passwords the same?", bcryptjs.compareSync(req.body.secretword, user.password))
    }
  } catch(err) {
    console.log("ERROR @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", err);
    res.redirect("/admin/login");
  }
  

  //res.redirect("/admin/login");
  /*
  let user = {password: "",
username: ""};
  user.password = bcryptjs.hashSync(req.body.secretword);
  user.username = req.body.adminName;
  console.dir(user) */
})

module.exports = router;