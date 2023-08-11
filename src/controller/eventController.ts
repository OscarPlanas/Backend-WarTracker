import { Request, Response } from 'express';
import Event from '../model/Event';

// Create a new event
const createEvent = async (req: Request, res: Response) => {7
    console.log(req.body);
    try {
        const event = new Event(req.body);
        await event.save((err: any) => {
            if (err) {
             return res.status(500).send(err);
            }
            res.status(200).json({ status: 'Event saved' });
     });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getEventByUser = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.params;
        const events = await Event.find({ user: id_user });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllEvents = async (req: Request, res: Response) => {
    const events = await Event.find().populate('author');
    res.json(events);
};

const deleteEvent = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    await event.remove();
    res.json({ status: 'Event deleted' });
};

const deleteEventByMeetingID = async (req: Request, res: Response) => {
    const event = await Event.findOne({ meeting: req.params.id_meeting });
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    await event.remove();
    res.json({ status: 'Event deleted' });
};

export default{ createEvent, getAllEvents, getEventByUser, deleteEvent, deleteEventByMeetingID };

