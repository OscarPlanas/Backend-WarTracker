import Meeting from '../model/Meeting';
import User from '../model/User';

import { Request, Response } from 'express';
const getall = async (req: Request, res: Response) => {
    const meetings = await Meeting.find().populate('organizer').populate('participants');
    res.json(meetings);
}
const getone = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.params.id).populate('organizer').populate('participants');
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    res.json(meeting);
}

const update = async (req: Request, res: Response) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const meeting = await Meeting.findByIdAndUpdate(req.params.id, {
            title, description
        }, {new: true});
        res.json(meeting).status(200);
    }catch (error) {
        res.status(401).send(error);
    }
}

const deleteMeeting = async (req: Request, res: Response) => {
    try {
        await Meeting.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Meeting deleted' });
    }
    catch (error) {
        res.status(500).json({message: 'Meeting not found', error });
    }
}

const addMeeting = async (req: Request, res: Response) => {
    const meeting = new Meeting(req.body);
    await meeting.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Meeting saved' });
    });
};
const setone = async (req: Request, res: Response) => {
    const meeting = new Meeting(req.body);
    await meeting.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Meeting saved' });
    });
    console.log(req.body);
}

/*const addParticipant = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.params.id_meeting);
    if(!meeting){
        return res.status(404).send('The meeting does not exist');
    }
    const participant = await User.findById(req.body.id);
    if(!participant){
        return res.status(404).send('The user does not exist');
    }
    if(meeting.participants.includes(participant?._id!)){
        return res.status(404).send('The user is already in the meeting');
    }
    participant.updateOne({$push: {meeting: meeting._id}}, (err: any) => {
        participant.save();
    });
    meeting.updateOne({$push: {participants: participant?._id}}, (err: any) => {
        meeting.save();
        res.status(200).json({status: 'Participant added'});
    });*/

const addParticipant = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
   const meeting = await Meeting.findById(req.params.idMeeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    if(meeting.participants.includes(user?._id!)){
        return res.status(404).send('The user is already in the meeting');
    }
   meeting.updateOne({ $push: { participants: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        meeting.save();
        res.status(200).json({ status: 'User saved' });
    });  
}

const deleteParticipant = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.idUser);
    if (!user) {
        return res.status(404).send('The user does not exist');
    }
    const meeting = await Meeting.findById(req.params.idMeeting);
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    if(!meeting.participants.includes(user?._id!)){
        return res.status(404).send('The user is not in the meeting');
    }
    meeting.updateOne({ $pull: { participants: user._id } }, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        meeting.save();
        res.status(200).json({ status: 'User deleted' });
    });   
}
export default {
    getall,
    getone,
    setone,
    update,
    deleteMeeting,
    addMeeting,
    addParticipant,
    deleteParticipant
}