const {Router} = require('express');

const postController = require('../controllers/postController');
const auth = require('../middleware/auth')

const router = Router();
router.get('/posts',auth, postController.getAllPosts);
router.post('/post',auth, postController.createPost);
router.delete('/post/:id',auth, postController.deletePost);
router.put('/post/:id', auth, postController.updatePost);
router.get('/post/:id', auth, postController.getSinglePost);

module.exports = router;