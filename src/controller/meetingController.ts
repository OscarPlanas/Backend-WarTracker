import Meeting from '../model/Meeting';
import User from '../model/User';

import { Request, Response } from 'express';
const getall = async (req: Request, res: Response) => {
    const meetings = await Meeting.find().populate('organizer');
    res.json(meetings);
}
const getone = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.params.id_meeting).populate('organizer').populate({
        path: 'comments',
        populate: { path: 'organizer' }
    });
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

export default {
    getall,
    getone,
    setone,
    update,
    deleteMeeting,
    addMeeting,
}