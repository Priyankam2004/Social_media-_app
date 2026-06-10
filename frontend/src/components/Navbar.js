import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import Avatar from './Avatar';
import EditProfile from './EditProfile';
import styles from './Navbar.module.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <span className={styles.logo}>CircleUp</span>
        <div className={styles.right}>
          <Avatar
            src={user?.profilePic}
            name={user?.name}
            size={38}
            onClick={() => setShowEdit(true)}
            style={{ border: '2px solid #667eea' }}
          />
          <button className={styles.logout} onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
      </nav>
      {showEdit && <EditProfile onClose={() => setShowEdit(false)} />}
    </>
  );
}
