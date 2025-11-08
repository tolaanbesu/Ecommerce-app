import React from 'react';
import './profile.css';

const Profile = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={e => e.stopPropagation()}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Profile;
