// Authenticate the cookie holding hash password
// need to connect to User
const User = require("../models/User");
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
var crypto = require('crypto');
// how do I parse cookies?

const checkSession =  async (req, res, next) => {
    try {   
      let username = req.cookies.username;
      let session_id = req.cookies.session_id;
      user = await User.findOne({ username: username })
      if (user.session_id === session_id) {
        req.auth = true;
      }  else {
        req.auth = false;
      }
    }
      catch (err) {
        console.log(err);
        req.auth = false;
      }
      next();
    }

    module.exports = checkSession;