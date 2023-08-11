import { Schema, model } from 'mongoose';

const Event = new Schema({
	title: String,
    date: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    meeting: {
        type: Schema.Types.ObjectId,
        ref: "Meeting"
    }
});

export default model('Event', Event);