//const { Schema, Model } = require("mongoose");
const { Schema } = require("mongoose");
const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)
//const User = require('./User');

marked.setOptions({
	gfm: true,
	breaks: true
});

const postSchema = new Schema({
	title: String,
	markdown: {
		required: true,
		type: String
	},
	date:  { type: Date, default: Date.now },
	tags: [String],
	user: {type: Schema.Types.ObjectId, ref: "user"},
	description: String,
	slug: {
		required: true,
		type: String
	},
	html: {
		required: true,
		type: String
	}
});

postSchema.pre('validate', function(next){
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true })
	}

	if (this.markdown) {
    this.html = dompurify.sanitize(marked(this.markdown))
	}
	
	next();
	}
);

const Post = mongoose.model('post', postSchema);


// expose User model for export
module.exports = Post; 