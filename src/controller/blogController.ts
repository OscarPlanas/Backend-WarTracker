import Blog from '../model/Blog';
import Comment from '../model/Comment';
import User from '../model/User';

import { Request, Response } from 'express';
import mongoose from 'mongoose';

const getall = async (req: Request, res: Response) => {
    const blogs = await Blog.find().populate('author');
    res.json(blogs);
}
const getone = async (req: Request, res: Response) => {
    const blog = await Blog.findById(req.params.id_blog).populate('author').populate('usersLiked');
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
        const imageUrl = req.body.imageUrl;
        const blog = await Blog.findByIdAndUpdate(req.params.id, {
            title, description, body_text, imageUrl
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
    const blog = await Blog.findById(req.params.id_blog);
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    const comments = await Comment.find({ _id: { $in: blog.comments } }).populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });
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

const addUserLiked = async (req: Request, res: Response) => {
    console.log("entramos en addUserLiked");
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
    const blog = await Blog.findById(req.params.idBlog);
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    if (blog.usersLiked.includes(user?._id!)) {
        return res.status(404).send('The user is already in the blog');
    }
    user.updateOne({ $push: { blogsLiked: blog._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("user saved");
        user.save();
    });

    blog.updateOne({ $push: { usersLiked: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        blog.save();
        res.status(200).json({ status: 'User saved' });
    });
}

const deleteUserLiked = async (req: Request, res: Response) => {
    console.log("entramos en deleteUserLiked");
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
    const blog = await Blog.findById(req.params.idBlog);
    if (!blog) {
        return res.status(404).send('The blog does not exist');
    }
    if (!blog.usersLiked.includes(user?._id!)) {
        return res.status(404).send('The user is not in the blog');
    }
    user.updateOne({ $pull: { blogsLiked: blog._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("user deleted");
        user.save();
    });
    blog.updateOne({ $pull: { usersLiked: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        blog.save();
        res.status(200).json({ status: 'User deleted' });
    });
}



        


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
    deleteDislikeToComment,
    addUserLiked,
    deleteUserLiked

}