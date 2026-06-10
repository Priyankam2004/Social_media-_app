import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/slices/postSlice';
import Avatar from './Avatar';
import styles from './CreatePost.module.css';

export default function CreatePost() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !image) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('caption', caption);
    if (image) fd.append('image', image);
    await dispatch(createPost(fd));
    setCaption('');
    setImage(null);
    setPreview(null);
    setLoading(false);
  };

  const removeImage = () => { setImage(null); setPreview(null); };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <Avatar src={user?.profilePic} name={user?.name} size={42} />
        <textarea
          className={styles.input}
          placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows={2}
        />
      </div>
      {preview && (
        <div className={styles.previewWrap}>
          <img src={preview} alt="preview" className={styles.preview} />
          <button className={styles.removeImg} onClick={removeImage}>✕</button>
        </div>
      )}
      <div className={styles.bottom}>
        <label className={styles.photoBtn}>
          📷 Photo
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>
        <button
          className={styles.postBtn}
          onClick={handleSubmit}
          disabled={loading || (!caption.trim() && !image)}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
