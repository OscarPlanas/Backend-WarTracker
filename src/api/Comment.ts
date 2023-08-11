import commentController from '../controller/commentController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();

router.get('/allcomments', commentController.getAllComments);
router.delete('/deletecomment/:id_comment', commentController.deleteComment);




export default router;
