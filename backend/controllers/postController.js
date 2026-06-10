const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    if (!caption && !image)
      return res.status(400).json({ message: 'Caption or image required' });

    const post = new Post({ user: req.userId, caption: caption || '', image });
    await post.save();

    const populated = await Post.findById(post._id)
      .populate('user', 'name profilePic');
    res.status(201).json(populated);
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('getPosts error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('deletePost error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some(id => id.toString() === req.userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error('likePost error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.userId, text: text.trim() });
    await post.save();

    // Re-fetch so the new comment has populated user
    const updated = await Post.findById(post._id)
      .populate('comments.user', 'name profilePic');
    const newComment = updated.comments[updated.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const commentExists = post.comments.some(
      c => c._id.toString() === req.params.commentId
    );
    if (!commentExists)
      return res.status(404).json({ message: 'Comment not found' });

    const comment = post.comments.find(
      c => c._id.toString() === req.params.commentId
    );
    if (
      comment.user.toString() !== req.userId &&
      post.user.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.comments = post.comments.filter(
      c => c._id.toString() !== req.params.commentId
    );
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('deleteComment error:', err);
    res.status(500).json({ message: err.message });
  }
};
