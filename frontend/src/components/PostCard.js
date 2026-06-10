import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, deletePost, addComment, deleteComment } from '../redux/slices/postSlice';
import Avatar from './Avatar';
import styles from './PostCard.module.css';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.includes(user?._id);
  const isOwner = post.user?._id === user?._id;

  const handleLike = () => dispatch(likePost(post._id));
  const handleDelete = () => { if (window.confirm('Delete this post?')) dispatch(deletePost(post._id)); };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ postId: post._id, text: commentText.trim() }));
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ postId: post._id, commentId }));
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar src={post.user?.profilePic} name={post.user?.name} size={44} />
          <div>
            <p className={styles.name}>{post.user?.name}</p>
            <p className={styles.time}>{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <button className={styles.deleteBtn} onClick={handleDelete} title="Delete post">🗑</button>
        )}
      </div>

      {post.caption && <p className={styles.caption}>{post.caption}</p>}

      {post.image && (
        <img
          src={`${process.env.REACT_APP_API_URL}${post.image}`}
          alt="post"
          className={styles.image}
        />
      )}

      <div className={styles.stats}>
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <span
          className={styles.commentCount}
          onClick={() => setShowComments(!showComments)}
        >
          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comment
        </button>
      </div>

      {showComments && (
        <div className={styles.comments}>
          {post.comments.map(c => (
            <div key={c._id} className={styles.comment}>
              <Avatar src={c.user?.profilePic} name={c.user?.name} size={32} />
              <div className={styles.commentBody}>
                <p className={styles.commentName}>{c.user?.name}</p>
                <p className={styles.commentText}>{c.text}</p>
              </div>
              {(c.user?._id === user?._id || isOwner) && (
                <button
                  className={styles.deleteComment}
                  onClick={() => handleDeleteComment(c._id)}
                  title="Delete comment"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <form onSubmit={handleComment} className={styles.commentForm}>
            <Avatar src={user?.profilePic} name={user?.name} size={32} />
            <input
              className={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={!commentText.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
