import gameController from '../controller/gameController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();

router.get('/:id_game', gameController.getone);
router.put('/:id', gameController.update);
router.delete('/:id', gameController.deleteGame);
router.post('/', gameController.addGame);
router.get('/tournament/:id_tournament', gameController.getByTournament);
router.put('/tournament/:id_tournament/:id_player', gameController.addGamebyTournament);
router.post('/tournament/:id_tournament', gameController.addGamebyTournamentID);
router.delete('/tournament/:id_tournament', gameController.deleteGameByTournament);
router.delete('/row/:_id', gameController.deleteRowByTournamentID);
router.get('/', gameController.getall);
export default router;