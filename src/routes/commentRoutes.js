const {Router} = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth')

const router = Router();

router.post('/posts/:postId/comments',auth,  commentController.createComment);
router.get("/posts/:postId/comments", auth, commentController.getAllComments);
router.put("/comments/:id", auth, commentController.updateComment);
router.delete('/comment/:id', auth, commentController.deleteComment)
module.exports = router