import { Router } from 'express';
import userController from '../controller/userController';

const router = Router();

router.post('/register', userController.register);
router.get('/', userController.getall);
router.get('/:id', userController.getone);
router.delete('/:id', userController.deleteUser);
router.put('/edit/:id', userController.update);
router.get('/email/:email', userController.getbyemail);
router.post('/followUser/:idUser/:idFollowed', userController.followUser);
router.delete('/unfollowUser/:idUser/:idFollowed', userController.unfollowUser);

export default router;