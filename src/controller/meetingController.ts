import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../model/Comment';
import Meeting from '../model/Meeting';
import User from '../model/User';

// Function to get all meetings
const getall = async (req: Request, res: Response) => {
    const meetings = await Meeting.find().populate('organizer').populate('participants');
    res.json(meetings);
}

// Function to get a specific meeting by ID
const getone = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.params.id).populate('organizer').populate('participants');
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    res.json(meeting);
}

// Function to update a meeting
const update = async (req: Request, res: Response) => {
    try {

        const title = req.body.title;
        const location = req.body.location;
        const date = req.body.date;
        const registration_fee = req.body.registration_fee;
        const description = req.body.description;
        const imageUrl = req.body.imageUrl;
        const lat = req.body.lat;
        const lng = req.body.lng;
        const meeting = await Meeting.findByIdAndUpdate(req.params.id, {
            title, description, location, date, registration_fee, imageUrl, lat, lng
        }, { new: true });
        res.json(meeting).status(200);
    } catch (error) {
        res.status(401).send(error);
    }
}

// Function to delete a meeting
const deleteMeeting = async (req: Request, res: Response) => {
    try {
        await Meeting.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Meeting deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Meeting not found', error });
    }
}

// Function to add a new meeting
const addMeeting = async (req: Request, res: Response) => {
    const meeting = new Meeting(req.body);
    await meeting.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Meeting saved' });
    });
};

// Function to set one meeting
const setone = async (req: Request, res: Response) => {
    const meeting = new Meeting(req.body);
    await meeting.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Meeting saved' });
    });
    console.log(req.body);
}

// Function to add a participant to a meeting
const addParticipant = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
    const meeting = await Meeting.findById(req.params.idMeeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    if (meeting.participants.includes(user?._id!)) {
        return res.status(404).send('The user is already in the meeting');
    }

    user.updateOne({ $push: { meetingsFollowed: meeting._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("user saved");
        user.save();
    });

    meeting.updateOne({ $push: { participants: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        meeting.save();
        res.status(200).json({ status: 'User saved' });
    });
}

// Function to delete a participant from a meeting
const deleteParticipant = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
    const meeting = await Meeting.findById(req.params.idMeeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    if (!meeting.participants.includes(user?._id!)) {
        return res.status(404).send('The user is not in the meeting');
    }
    user.updateOne({ $pull: { meetingsFollowed: meeting._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("user saved");
        user.save();
    });
    meeting.updateOne({ $pull: { participants: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        meeting.save();
        res.status(200).json({ status: 'User deleted' });
    });
}

// Function to get comments associated with a meeting
const getComments = async (req: Request, res: Response) => {

    const meeting = await Meeting.findById(req.params.id_meeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    const comments = await Comment.find({ _id: { $in: meeting.comments } }).populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });

    res.json(comments);
};

// Function to get a specific comment by ID, including owner and replies
const getOneComment = async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id_comment).populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    res.json(comment);
};

// Function to add a comment to a meeting and update the meeting's comments list
const addComment = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.params.id_meeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    const comment = new Comment(req.body);
    await comment.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
    });
    meeting.updateOne({ $push: { comments: comment._id } }, (err: any) => {
        meeting.save();
        res.status(200).json({ status: 'Comment saved' });
    });
};

// Function to add a reply to a comment and update the comment's replies list
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

// Function to add a like to a comment
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

// Function to delete a like from a comment
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

// Function to add a dislike to a comment
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

// Function to delete a dislike from a comment
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

// Function to get all comments, including owner and replies
const getAllComments = async (req: Request, res: Response) => {
    const comments = await Comment.find().populate('owner').populate({
        path: 'replies',
        populate: { path: 'owner' }
    });
};

export default {
    getall,
    getone,
    setone,
    update,
    deleteMeeting,
    addMeeting,
    addParticipant,
    deleteParticipant,
    getComments,
    getOneComment,
    addComment,
    addReply,
    addLikeToComment,
    deleteLikeToComment,
    addDislikeToComment,
    deleteDislikeToComment,
    getAllComments
}