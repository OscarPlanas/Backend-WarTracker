import meetingController from '../controller/meetingController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();


router.get('/:id', meetingController.getone);
router.put('/edit/:id', meetingController.update);
router.delete('/:id',[verifyToken], meetingController.deleteMeeting);
router.post('/', meetingController.addMeeting);
//router.post('/join/:id', meetingController.addParticipant);
router.put('/join/:idUser/:idMeeting',meetingController.addParticipant);
router.put('/leave/:idUser/:idMeeting',meetingController.deleteParticipant);
router.get('/comments/:id_meeting', meetingController.getComments);
router.get('/getonecomment/:id_comment', meetingController.getOneComment);
router.post('/addcomment/:id_meeting',meetingController.addComment);
router.post('/addreply/:id_comment',meetingController.addReply);
router.post('/like/:id_comment/:idUser', meetingController.addLikeToComment);
router.delete('/cancellike/:id_comment/:idUser', meetingController.deleteLikeToComment);
router.post('/dislike/:id_comment/:idUser', meetingController.addDislikeToComment);
router.delete('/canceldislike/:id_comment/:idUser', meetingController.deleteDislikeToComment);

router.get('/', meetingController.getall);


export default router;