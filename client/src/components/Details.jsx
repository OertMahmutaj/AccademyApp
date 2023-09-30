import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../styles/details.css';

const Details = (props) => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/user/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="details-container">
      <p className="details-label">Name:</p>
      <p className="details-info">{user.name}</p>
      <p className="details-label">Email:</p>
      <p className="details-info">{user.email}</p>
      <p className="details-label">Password:</p>
      <p className="details-info">{user.password}</p>
      <img src={user.imgUrl} width={50} alt="userpic" className="user-image" />
      <p className="details-label">Role:</p>
      <p className="details-info">{user.role}</p>
      <p className="details-label">Belt:</p>
      <input
        type="checkbox"
        checked={user.belt || false} // Ensure it's not undefined
        readOnly
        className="details-checkbox"
      />
      <p className="details-label">Degree:</p>
      <input
        type="checkbox"
        checked={user.degree || false} // Ensure it's not undefined
        readOnly
        className="details-checkbox"
      />
      <Link to={`/user/edit/${user._id}`} className="edit-link">
        Go to Edit Page
      </Link>
    </div>
  );
};

export default Details;
