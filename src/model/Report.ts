import { Schema, model } from 'mongoose';

const Report = new Schema({
    owner: String,
    reported: String,
    reason: String,
    date: Date,
    type: String,

});

export default model('Report', Report);