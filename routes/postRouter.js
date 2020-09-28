
var express = require('express');
// import path module
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
// set up router
var router = express.Router()

router.get('/:slug', async function(req, res, next) {
  try {
      const post = await Post.findOne({ slug: req.params.slug }).populate('user', 'username');

      console.log('popop', post);
      res.render('apost', {post: post});
  } catch(err) {
      console.log(err);
      next(err);
  }
});

module.exports = router;