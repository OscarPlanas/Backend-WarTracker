import commentController from '../controller/commentController';
import { Router } from 'express';

const router = Router();

router.get('/allcomments', commentController.getAllComments);
router.delete('/deletecomment/:id_comment', commentController.deleteComment);

export default router;
