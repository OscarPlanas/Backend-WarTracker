import { Schema, model } from 'mongoose';

const Chat = new Schema({
    client1: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    client2: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],

});

export default model('Chat', Chat);