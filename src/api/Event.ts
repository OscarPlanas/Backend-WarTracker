import eventController from '../controller/eventController';
import { Router } from 'express';

const router = Router();

router.get('/allevents', eventController.getAllEvents);
router.get('/geteventbyuser/:id_user', eventController.getEventByUser);
router.post('/createevent', eventController.createEvent);
router.delete('/deleteevent/:id_event', eventController.deleteEvent);
router.delete('/deleteeventbymeetingid/:id_meeting', eventController.deleteEventByMeetingID);

export default router;