import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import Avatar from './Avatar';
import styles from './EditProfile.module.css';

export default function EditProfile({ onClose }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [picFile, setPicFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (picFile) fd.append('profilePic', picFile);
    const result = await dispatch(updateProfile(fd));
    if (!result.error) onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Edit Profile</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarWrap}>
            <Avatar src={preview || user?.profilePic} name={user?.name} size={80} />
            <label className={styles.changePhoto}>
              Change Photo
              <input type="file" accept="image/*" onChange={handlePic} hidden />
            </label>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <input
            className={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            className={styles.textarea}
            placeholder="Bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
