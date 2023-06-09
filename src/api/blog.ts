import blogController from '../controller/blogController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();


router.get('/:id_blog', blogController.getone);
router.put('/edit/:id', blogController.update);
router.delete('/:id',[verifyToken], blogController.deleteBlog);
router.get('/comments/:id_blog', blogController.getComments);
router.get('/getonecomment/:id_comment', blogController.getOneComment);
router.post('/addcomment/:id_blog',blogController.addComment);
router.post('/addreply/:id_comment',blogController.addReply);
router.post('/', blogController.addBlog);
router.post('/like/:id_comment/:idUser', blogController.addLikeToComment);
router.delete('/cancellike/:id_comment/:idUser', blogController.deleteLikeToComment);
router.post('/dislike/:id_comment/:idUser', blogController.addDislikeToComment);
router.delete('/canceldislike/:id_comment/:idUser', blogController.deleteDislikeToComment);
router.get('/', blogController.getall);
// router.get('/',[verifyToken], eventController.getall);

// router.get('/:id_event',[verifyToken], eventController.getone);
// router.put('/:id',[verifyToken], eventController.update);
// router.delete('/:id',[verifyToken], eventController.deleteEvent);
// router.post('/:id_event/join', eventController.addParticipant);
// router.get('/:id_event/comments', eventController.getComments);
// router.get('/:id_event/comments/:id_comment', eventController.getComment);
// router.post('/:id_event/comments', eventController.addComment);
// router.put('/:id_event/comments/:id_comment', eventController.updateComment);
// router.delete('/:id_event/comments/:id_comment', eventController.deleteComment);
// router.post('/',[verifyToken], eventController.addEvent);

export default router;