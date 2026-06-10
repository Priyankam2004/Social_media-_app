import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/postSlice';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import styles from './Home.module.css';

export default function Home() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.posts);

  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className={styles.feed}>
        <CreatePost />
        {loading && <p className={styles.msg}>Loading posts...</p>}
        {!loading && posts.length === 0 && (
          <p className={styles.msg}>No posts yet. Be the first to post!</p>
        )}
        {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
