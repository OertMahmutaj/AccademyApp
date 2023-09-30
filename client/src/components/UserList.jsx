import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/userlist.css'

const UserList = (props) => {
  const [user, setUser] = useState([]);
  const [updated, setUpdated] = useState(false);

  const removeFromDom = (userId) => {
    setUser(user.filter((a) => a._id !== userId));
  };

  const deleteUser = (userId) => {
    axios
      .delete(`http://localhost:8000/api/user/${userId}`)
      .then((res) => {
        removeFromDom(userId);
        setUpdated(!updated);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/user')
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updated]);

  const sortedUsers = Array.isArray(user)
    ? user.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    : [];

  return (
    <div className="user-list-container">
      {sortedUsers.map((user, index) => (
        <div className="user-item" key={index}>
          <p>{user.name}</p>
          {user.role === 'teacher' && <p className="user-role">{user.role}</p>}
          <img src={user.imgUrl} alt="user pic" width="50" />
          <Link to={`/user/${user._id}`} className="view-profile-link">
            View Profile
          </Link>
          <button
            onClick={(e) => deleteUser(user._id)}
            className="delete-button"
          >
            Delete User
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
