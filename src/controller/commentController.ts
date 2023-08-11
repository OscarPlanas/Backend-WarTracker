import { Request, Response } from 'express';
import Comment from '../model/Comment';

const getAllComments = async (req: Request, res: Response) => {
    const comments = await Comment.find().populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });
    res.json(comments);
};

const deleteComment = async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id_comment);
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    await comment.remove();
    res.json({ status: 'Comment deleted' });
};


export default { getAllComments, deleteComment };
