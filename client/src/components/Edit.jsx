import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/edit.css';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    imgUrl: '',
    role: '',
    belt: false,
    degree: false,
  });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/user/${id}`)
      .then((res) => {
        const userDataFromAPI = res.data;

        setUserData({
          ...userDataFromAPI,
          belt: userDataFromAPI.belt || false,
          degree: userDataFromAPI.degree || false,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const updateUser = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:8000/api/user/${id}`, userData)
      .then((res) => {
        console.log(res);
        navigate('/user');
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          const validationErrors = err.response.data.errors;
          setErrors(Object.values(validationErrors));
        } else {
          console.error(err);
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = (fieldName) => (e) => {
    setUserData({ ...userData, [fieldName]: e.target.checked });
  };

  return (
    <div className="edit-container">
      <h1 className="edit-heading">Update User</h1>
      <form onSubmit={updateUser} className="edit-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          className="edit-input"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          className="edit-input"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          className="edit-input"
        />

        <label>Profile Picture URL</label>
        <input
          type="url"
          name="imgUrl"
          value={userData.imgUrl}
          onChange={handleInputChange}
          className="edit-input"
        />

        <label>Role</label>
        <select
          name="role"
          value={userData.role}
          onChange={handleInputChange}
          className="edit-input"
        >
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <div className="edit-checkbox-label">
          <label className="edit-checkbox">
            Belt
            <input
              type="checkbox"
              checked={userData.belt}
              onChange={handleCheckboxChange('belt')}
            />
          </label>

          <label className="edit-checkbox">
            Degree
            <input
              type="checkbox"
              checked={userData.degree}
              onChange={handleCheckboxChange('degree')}
            />
          </label>
        </div>

        {errors.length > 0 && (
          <div className="edit-errors">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <button type="submit" className="edit-submit-button">
          Update User
        </button>
      </form>
    </div>
  );
};

export default Edit;
