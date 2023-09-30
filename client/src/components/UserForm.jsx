import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/userform.css';

const UserForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState([]);
  const [belt, setBelt] = useState(false);
  const [degree, setDegree] = useState(false);

  const addUserToList = (newUser) => {
    setUser([...user, newUser]);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email, password, imgUrl, role, belt, degree };

    axios
      .post('http://localhost:8000/api/user/new', userData)
      .then((res) => {
        console.log(res.data);
        addUserToList(res.data);
        setName('');
        setEmail('');
        setPassword('');
        setImgUrl('');
        setRole('');
        setErrors([]);
        navigate('/user');
        setBelt(false);
        setDegree(false);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          const validationErrors = err.response.data.errors;
          if (validationErrors.role === 'A teacher already exists.') {
            setErrors([validationErrors.role]);
          } else {
            setErrors(Object.values(validationErrors));
          }
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className="user-form-container">
      <form name='createUser' onSubmit={onSubmitHandler}>
        <p>
          <label htmlFor='name'>Name</label>
          <br />
          <input
            id="name"
            autoComplete="given-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </p>
        <p>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </p>
        <p>
          <label>Profile Picture URL</label>
          <br />
          <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            className="form-control"
          />
        </p>
        <p>
          <label>Role</label>
          <br />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </p>
        <p>
          <label>Belt Exam</label>
          <br />
          <input
            type="checkbox"
            onChange={(e) => setBelt(e.target.checked)}
            className="form-check-input"
          />
        </p>
        <p>
          <label>Degree</label>
          <br />
          <input
            type="checkbox"
            onChange={(e) => setDegree(e.target.checked)}
            className="form-check-input"
          />
        </p>
        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <p key={index} className="error-text">
                {error}
              </p>
            ))}
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default UserForm;
