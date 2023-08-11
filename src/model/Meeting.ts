import { Schema, model } from 'mongoose';

const Meeting = new Schema({
	title: String,
    imageUrl: String,
    description: String,
    lat: Number,
    lng: Number,
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: String,
    location: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    registration_fee: Number,

});

export default model('Meeting', Meeting);