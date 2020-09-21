//const { Schema, Model } = require("mongoose");
const { Schema } = require("mongoose");
const mongoose = require('mongoose');
const postSchema = new Schema({
	title: String,
	markdown: String,
	date:  { type: Date, default: Date.now },
	tags: [String],
	user: {type: Schema.Types.ObjectId, ref: "User"},
	description: String
});


const Post = mongoose.model('post', postSchema);


// expose User model for export
module.exports = Post; 