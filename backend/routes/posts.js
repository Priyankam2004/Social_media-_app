const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const {
  createPost, getPosts, deletePost, likePost, addComment, deleteComment
} = require('../controllers/postController');

router.get('/', auth, getPosts);
router.post('/', auth, upload.single('image'), createPost);
router.delete('/:id', auth, deletePost);
router.put('/:id/like', auth, likePost);
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);

module.exports = router;
