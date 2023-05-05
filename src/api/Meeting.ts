import meetingController from '../controller/meetingController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();

router.get('/', meetingController.getall);
router.get('/:id', meetingController.getone);
router.put('/:id',[verifyToken], meetingController.update);
router.delete('/:id',[verifyToken], meetingController.deleteMeeting);
router.post('/', meetingController.addMeeting);
//router.post('/join/:id', meetingController.addParticipant);
router.put('/join/:idUser/:idMeeting',meetingController.addParticipant);
router.put('/leave/:idUser/:idMeeting',meetingController.deleteParticipant);

export default router;