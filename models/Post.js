//const { Schema, Model } = require("mongoose");
const { Schema } = require("mongoose");
const postSchema = new Schema({
	title: String,
	body: String,
	date:  { type: Date, default: Date.now },
	tags: [String],
  user: {type: Schema.Types.ObjectId, ref: "User"}
});


const Post = mongoose.model('post', postSchema);


// expose User model for export
module.exports = Post; 