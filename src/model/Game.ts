import { Schema, model } from 'mongoose';

const Game = new Schema({
    tournament: {
        type: Schema.Types.ObjectId,
        ref: "Meeting"
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    alliance: String,
    victory_points_favour: Number,
    victory_points_against: Number,
    difference_points: Number,
    games_played: Number,
    leaders_eliminated: Number,

});

export default model('Game', Game);

