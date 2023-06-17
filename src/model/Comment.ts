import { Schema, model } from 'mongoose';

const Comment = new Schema({
    content: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

export default model('Comment', Comment);