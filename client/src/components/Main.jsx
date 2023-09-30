import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import UserForm from './UserForm';

const Main = (props) => {
  // const [user, setUser] = useState([]);

  // const removeFromDom = (userId) => {
  //   setUser(user.filter((a) => a._id !== userId));
  // };

  return (
    <div>
      {/* <Link to={`/author/new`}></Link>
      <Authorform author={author} setAuthor={setAuthor} addAuthorToList={addAuthorToList} />
      <hr /> */}
      {/* <Link to={`/user/new`}>Create New Account</Link>
      <Link to={`/user`}> List of users</Link> */}
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS835nHFVBO2scSFgav_IdfY7x7KEZgq-Q_zg&usqp=CAU" alt=":)" />
      
      {/* <UserList user={user} setUser={setUser} removeFromDom={removeFromDom} /> */}
    </div>
  );
};

export default Main;
