import { Schema, model } from 'mongoose';

const Blog = new Schema({
	title: String,
    image: String,
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
    
});

export default model('Blog', Blog);