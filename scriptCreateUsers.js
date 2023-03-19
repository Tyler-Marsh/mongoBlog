const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { Schema } = require("mongoose");

// handle mongoose error
mongoose.set("useUnifiedTopology", true);

/* CONNECT TO database */
mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Successfully connected to MongoDB");
});

// create the user schema
const userSchema = new Schema({
  username: String,
  password: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

// constructor for the model
const User = mongoose.model("user", userSchema);

/* Collect user information */
let commandArgs = process.argv.slice(2, 4);

username = commandArgs[0];
password = commandArgs[1];

/*  Encrypt user password  */
password = bcryptjs.hashSync(password);

/* Create user object    */
const newUser = new User({ username: username, password: password });

/* SAVE NEW USER INFO */

newUser.save(function (err, newUser) {
  if (err) {
    console.error(err);
    // exit for commandline use
    process.exit();
  } else {
    console.dir("SAVED!");

    // exit for commandline use
    process.exit();
  }
});
