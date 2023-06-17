import Blog from '../model/Blog';
import Comment from '../model/Comment';

import { Request, Response } from 'express';
import mongoose from 'mongoose';

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
    await blog.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Blog saved' });
    });
    console.log(req.body);
}

const update = async (req: Request, res: Response) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const body_text = req.body.body_text;
        const blog = await Blog.findByIdAndUpdate(req.params.id, {
            title, description, body_text
        }, { new: true });
        res.json(blog).status(200);
    } catch (error) {
        res.status(401).send(error);
    }
}

const deleteBlog = async (req: Request, res: Response) => {
    try {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Blog deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Blog not found', error });
    }
}

const addBlog = async (req: Request, res: Response) => {
    const blog = new Blog(req.body);
    await blog.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Blog saved' });
    });
};

const getComments = async (req: Request, res: Response) => {
    /*const blogs = await Blog.find().populate('author');
    res.json(blogs);*/
    const blog = await Blog.findById(req.params.id_blog);
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    const comments = await Comment.find({ _id: { $in: blog.comments } }).populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });
    /*const blog = await Blog.findById(req.params.id_blog).populate('author').populate({
      path: 'comments',
      populate: { path: 'author' }
  });*/
    res.json(comments);
};

const getOneComment = async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id_comment).populate('owner').populate({path: 'replies',
    populate: { path: 'owner' }
});
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    res.json(comment);
};


const addComment = async (req: Request, res: Response) => {
    const blog = await Blog.findById(req.params.id_blog);
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    const comment = new Comment(req.body);
    await comment.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
    });
    blog.updateOne({ $push: { comments: comment._id } }, (err: any) => {
        blog.save();
        res.status(200).json({ status: 'Comment saved' });
    });
};

const addReply = async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id_comment);
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    const reply = new Comment(req.body);
    await reply.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
    });
    comment.updateOne({ $push: { replies: reply._id } }, (err: any) => {
        comment.save();
        res.status(200).json({ status: 'Reply saved' });
    });
};

const addLikeToComment = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id_comment);
        console.log(req.params.idUser);


        const comment = await Comment.findById(req.params.id_comment);
        if (!comment) {
            return res.status(404).send('The comment does not exist');
        }

        const userId = new mongoose.Types.ObjectId(req.params.idUser);

        const hasLiked = comment.likes.includes(userId);

        if (hasLiked) {
            return res.status(404).send('The user has already liked the comment');
        }


        comment.updateOne({ $push: { likes: userId } }, (err: any) => {
            comment.save();
            res.status(200).json({ status: 'Like saved' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Comment not found', error });
    }
};

const deleteLikeToComment = async (req: Request, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.id_comment);
      if (!comment) {
        return res.status(404).send('The comment does not exist');
      }
  
      const userId = new mongoose.Types.ObjectId(req.params.idUser);
  
      comment.updateOne({ $pull: { likes: userId } }, (err: any) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting the like', error: err });
        }
        res.status(200).json({ status: 'Like deleted' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Comment not found', error });
    }
  };
  
const addDislikeToComment = async (req: Request, res: Response) => {
    try {
        const comment = await Comment.findById(req.params.id_comment);
        if (!comment) {
            return res.status(404).send('The comment does not exist');
        }

        const userId = new mongoose.Types.ObjectId(req.params.idUser);

        const hasDisliked = comment.dislikes.includes(userId);
        if (hasDisliked) {
            return res.status(404).send('The user has already liked the comment');
        }

       
        comment.updateOne({ $push: { dislikes: userId } }, (err: any) => {
            comment.save();
            res.status(200).json({ status: 'Dislike saved' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Comment not found', error });
    }
};

const deleteDislikeToComment = async (req: Request, res: Response) => {
    console.log("entramos en deleteDislikeToComment");
    try {
        const comment = await Comment.findById(req.params.id_comment);
        if (!comment) {
            return res.status(404).send('The comment does not exist');
        }

        const userId = new mongoose.Types.ObjectId(req.params.idUser);

        comment.updateOne({ $pull: { dislikes: userId } }, (err: any) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting the dislike', error: err });
            }
            res.status(200).json({ status: 'Dislike deleted' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Comment not found', error });
    }
};

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
    getComments,
    addComment,
    addReply,
    addLikeToComment,
    getOneComment,
    deleteLikeToComment,
    addDislikeToComment,
    deleteDislikeToComment

}