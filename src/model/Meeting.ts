import { Schema, model } from 'mongoose';

const Meeting = new Schema({
	title: String,
    imageUrl: String,
    description: String,
    //lat: Number,
    //lng: Number,
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
    //vote_average: {type: Number, min: 0, max: 10, default: 0},
    //vote_count: {type: Number, min: 0, default: 0},
});

export default model('Meeting', Meeting);