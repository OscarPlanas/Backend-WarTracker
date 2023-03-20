import { Schema, model } from 'mongoose';

const User = new Schema({
	name: String,
	username: String,
	password: String,
	birthdate: Date,
	email: String,
	isAdmin: Boolean,
	matches: Number,
	points: Number,
});

export default model('User', User);

