import { Schema, model } from 'mongoose';

const User = new Schema({
	name: String,
	username: String,
	password: String,
	date: String,
	birthdate: Date,
	email: String,
	isAdmin: Boolean,
	matches: Number,
	points: Number,
	imageUrl: String,
	backgroundImageUrl: String,
	about: String,
	meetingsFollowed:[{
		type: Schema.Types.ObjectId,
		ref: "Meeting"
	}],
	blogsLiked:[{
		type: Schema.Types.ObjectId,
		ref: "Blog"
	}],
	followers:[{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	following:[{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
});

export default model('User', User);

