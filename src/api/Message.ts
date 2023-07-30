import messageController from '../controller/messageController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();


router.get('/:id_chat', messageController.getAllMessagesofChat);
router.post('/saveMessage', messageController.message);

router.get('/', messageController.getAllMessages);
export default router;