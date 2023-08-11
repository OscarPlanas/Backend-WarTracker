import blogController from '../controller/blogController';
import { Router } from 'express';
import { verifyToken, isOwner } from '../middlewares/authJWT'

const router = Router();


router.get('/:id_blog', blogController.getone);
router.put('/edit/:id', blogController.update);
router.delete('/:id', blogController.deleteBlog);
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

router.put('/likeblog/:idUser/:idBlog',blogController.addUserLiked);
router.put('/dislikeblog/:idUser/:idBlog',blogController.deleteUserLiked);

export default router;