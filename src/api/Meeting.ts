import meetingController from '../controller/meetingController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();

router.get('/', meetingController.getall);
router.get('/:id_blog', meetingController.getone);
router.put('/:id',[verifyToken], meetingController.update);
router.delete('/:id',[verifyToken], meetingController.deleteMeeting);
router.post('/', meetingController.addMeeting);

export default router;