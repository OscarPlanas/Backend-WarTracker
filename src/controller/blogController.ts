import Blog from '../model/Blog';
import User from '../model/User';

import { Request, Response } from 'express';
const getall = async (req: Request, res: Response) => {
    const blogs = await Blog.find().populate('author');
    res.json(blogs);
}
const getone = async (req: Request, res: Response) => {
    const blog = await Blog.findById(req.params.id_blog).populate('author').populate({
        path: 'comments',
        populate: { path: 'author' }
    });
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    res.json(blog);
}
const setone = async (req: Request, res: Response) => {
    const blog = new Blog(req.body);
    await blog.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Blog saved' });
    });
    console.log(req.body);
}

const update = async (req: Request, res: Response) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const blog = await Blog.findByIdAndUpdate(req.params.id, {
            title, description
        }, {new: true});
        res.json(blog).status(200);
    }catch (error) {
        res.status(401).send(error);
    }
}

const deleteBlog = async (req: Request, res: Response) => {
    try {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Blog deleted' });
    }
    catch (error) {
        res.status(500).json({message: 'Blog not found', error });
    }
}

const addBlog = async (req: Request, res: Response) => {
    const blog = new Blog(req.body);
    await blog.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Blog saved' });
    });
};


// const addComment = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event);
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     const comment = new Comment(req.body);
//     await comment.save( (err: any) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//     });
// 	event.updateOne({ $push: { comments: comment._id } }, (err: any) => {
// 		event.save();
// 		res.status(200).json({ status: 'Comment saved' });
// 	});
// }

// const addParticipant = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event);
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     const participant = await User.findById(req.body.id);
// 	if (!participant) {
// 		return res.status(404).send('The user does not exist');
// 	}
// 	if (event.participants.includes(participant?._id!)) {
// 		return res.status(404).send('The user is already a participant');
// 	}
// 	participant.updateOne({ $push: { event: event._id } }, (err: any) => {
// 		participant.save();
// 	});
//     event.updateOne({ $push: { participants: participant?._id } }, (err: any) => {
// 		event.save();
// 		res.status(200).json({ status: 'Participant saved' });
// 	});
// }

// const getComments = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event).populate('comments');
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     res.json(event.comments);
// }

// const getComment = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event).populate('comments');
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     const comment = await Comment.findById(req.params.id_comment);
//     if (!comment) {
//         return res.status(404).send('The comment does not exist');
//     }
//     res.json(comment);
// }

// const updateComment = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event);
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     await Comment.findByIdAndUpdate(req.params.id_comment, req.body, (err: any) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.status(200).json({ status: 'Comment updated' });
//     });
// }

// const deleteComment = async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id_event);
//     if (!event) {
//         return res.status(404).send('The event does not exist');
//     }
//     const comment = await Comment.findById(req.params.id_comment);
//     if (!comment) {
//         return res.status(404).send('The comment does not exist');
//     }
//     await Comment.findByIdAndDelete(req.params.id_comment, (err: any) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         event.update(
//             { _id: event._id },
//             { $pull: { comments: comment._id } },
//         );
//         event.save();
//         res.status(200).json({ status: 'Comment deleted' });
//     });
// }


export default {
    getall,
    getone,
    setone,
    update,
    deleteBlog,
    addBlog,
}