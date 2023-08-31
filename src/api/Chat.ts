import chatController from '../controller/chatController';
import { Router } from 'express';

const router = Router();

router.get('/:id_chat', chatController.getone);
router.post('/createchat', chatController.create);
router.get('/getAllChatsOfUser/:id_user', chatController.getAllChatsOfUser);
router.get('/getChatByUsers/:id_user_opening/:id_user_receiver', chatController.getChatByUsers);
router.get('/', chatController.getall);
router.delete('/:id_chat', chatController.deleteChat);

export default router;