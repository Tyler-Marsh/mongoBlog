
var express = require('express');
// import path module
const path = require('path');
// set up router
// for comparing passwords
const bcryptjs = require('bcryptjs');
// using cookies
//const cookieParser = require('cookie-parser');
//const mongoose = require('mongoose');
var crypto = require('crypto');
// import config to pass API route into views
// path to find the includes in EJS

// formatting spaces for the markdown

//const parseSpaces = require("../middleware/parseSpaces");

const Post = require('../models/Post');

//const { baseApiUrl } = require("./config");

//MIDDLE WARE
const checkSession = require('../middleware/checkSession');
const parseTags = require('../middleware/parseTags');

// PATH FOR includes
let formFieldsPath = path.join(__dirname, '../views/_form_fields');
let deleteFormFieldsPath = path.join(__dirname, '../views/_delete_form_fields');
let postPath = path.join(__dirname, '../views/admin/_post');
/* generates session ID */
var generate_key = function() {
  // 16 bytes is likely to be more than enough,
  // but you may tweak it to your needs
  return crypto.randomBytes(16).toString('base64');
};

const User = require('../models/User');
//const { isObject } = require('util');

var router = express.Router()

// RELATIVE PATH WORKS FOR VIEWS
// SEPARATE ADMIN ROUTING
router.get("/login", function(req, res, next) {
  
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
      next();
      res.redirect("/admin/login");
  }
});

  
// NEEDS TO FETCH ALL POSTS AND PASS INTO VIEW
  
  router.get('/dashboard', checkSession, async function(req, res, next) {

    if (req.auth) {
      try {   
        const posts = await Post.find(function (err) {
          if (err) {
            next(err);
          }
        });

      res.render("admin/admin-dashboard", { layout: 'admin/adminlayout.ejs', posts: posts,
      path: postPath});

      } catch(err) {
        next(err);
        res.redirect('/');
      }
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
      next(err);
    }
    res.redirect('/');
  }
  res.redirect('/');
  })
  
  router.get('/dashboard/create', checkSession, function(req, res, next) {
      if (req.auth) {
        
        res.render("admin/admin-dashboard-create", { layout: 'admin/adminlayout.ejs',path: formFieldsPath, post: new Post()});
      }
  });

  router.post('/dashboard/create', checkSession, parseTags, async function(req, res, next) {
    if (req.auth) {
    // parseTags parses non-empty tags and puts them on body object
    const fields = req.body;
    
   // create new Post object
   // populated with fields on the body
   const userId = await User.findOne({ id: req.cookies.adminName });
  
   // parse the spaces....
   //fields.markdown = parseSpaces(fields.markdown);

    const newPost = new Post({ title: fields.title, description: fields.description, tags: fields.tags,markdown: fields.markdown, user: userId._id});
    await newPost.save(function(err) {
      if (err) {
        console.log(err);
        next(err);
      }
    });
    try {
      await userId.posts.push(newPost._id)
      await userId.save();
    }
    catch(err) {
      next(err);
    }
    // send to the edit page for the post to show it is a page
    res.redirect(`/admin/dashboard/edit/${newPost.slug}`);
    }
  });


  /* ROUTE FOR POST EDITING */
  // IF AUTH & POST
  // RENDER EDIT PAGE WITH DATA POPULATED
  // ELSE  RETURN TO ADMIN DASH
  // NO AUTH  REDIRECT TO INDEX OF SITE
  // 
  router.get('/dashboard/edit/:slug', checkSession, async function(req, res, next) {
    if (req.auth) {
      const post = await Post.findOne({ slug: req.params.slug})
      if (post) {
        res.render("admin/admin-dashboard-create", { layout: 'admin/adminlayout.ejs',
        path: formFieldsPath, post: post});
      } else {
        res.render("admin/admin-dashboard", { layout: 'admin/adminlayout.ejs'});
      }
    }
    else {
      res.redirect('/');
    }
  })


  router.post('/dashboard/edit/:slug', checkSession, parseTags, async function(req, res, next) {
    if (req.auth) {
      // checking preserved spacing
      const updatingPost = await Post.findOne({ slug: req.params.slug});
      const fields = req.body;
      // set the new fields
      updatingPost.title = fields.title;
      updatingPost.description = fields.description
      updatingPost.tags = fields.tags;
      // parse spaces
      // print type of markdown field
      //fields.markdown = parseSpaces(fields.markdown);
      updatingPost.markdown = fields.markdown;
      // updates the post
      await updatingPost.save();
      res.redirect(`/admin/dashboard/edit/${updatingPost.slug}`);
    }
  })

router.get('/dashboard/delete/:slug', checkSession, parseTags, async function(req, res, next) {
  try {
  const postToDelete = await Post.findOne({ slug: req.params.slug });
    res.render("admin/admin-dashboard-delete", { layout:"admin/adminlayout.ejs", post: postToDelete, path: deleteFormFieldsPath })

  } catch(err) {
    console.log(err)
    res.render("admin/admin-dashboard", { layout: 'admin/adminlayout.ejs'});
    res.redirect('/');
  }

})
  /* DELETE ROUTE */
  router.post('/dashboard/delete/:slug', checkSession, parseTags, async function(req, res, next)
   {
     try {
       await Post.deleteOne({ slug: req.params.slug }, function (err) {
         if (err) console.log(err);
       });
     } catch(err) {
       console.log(err);
     }
     res.redirect("/admin/dashboard");
  });
module.exports = router;