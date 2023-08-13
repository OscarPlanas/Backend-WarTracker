import { Router } from 'express';
import messageController from '../controller/messageController';

const router = Router();

router.get('/:id_chat', messageController.getAllMessagesofChat);
router.post('/saveMessage', messageController.message);
router.get('/', messageController.getAllMessages);

export default router;