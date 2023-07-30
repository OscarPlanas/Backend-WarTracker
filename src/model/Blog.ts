import { Schema, model } from 'mongoose';

const Blog = new Schema({
	title: String,
    description: String,
    body_text: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: String,
    imageUrl: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    usersLiked: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    
    
});

export default model('Blog', Blog);