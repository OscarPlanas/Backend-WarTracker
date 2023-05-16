import gameController from '../controller/gameController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();

router.get('/', gameController.getall);
router.get('/:id_game', gameController.getone);
router.put('/:id', gameController.update);
router.delete('/:id', gameController.deleteGame);
router.post('/', gameController.addGame);

export default router;