//const { Schema, Model } = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
});

const User = mongoose.model('user', userSchema);

// expose User model for export
module.exports = User; 