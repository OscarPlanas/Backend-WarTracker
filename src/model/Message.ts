import mongoose, { Schema, Document } from 'mongoose';

const Message = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: String,
    date: String,
    
});

export default mongoose.model('Message', Message);
