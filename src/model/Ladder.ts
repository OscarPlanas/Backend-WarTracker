import { Schema, model } from 'mongoose';

const Ladder = new Schema({
	players: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    matches: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    points: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    genre: String,
});

export default model('Ladder', Ladder);