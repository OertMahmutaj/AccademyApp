import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Main from './components/Main';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import Details from './components/Details';
import Edit from './components/Edit';
import './styles/app.css'; // Import your CSS file

function App() {
  return (
    <div className="container">
      <header>
        <h1 className="text-primary">Academy App</h1>
      </header>
      <BrowserRouter>
        <nav id="pillNav2">
          <Link className="nav-link active rounded-5" to="/">
            Home
          </Link>
          <Link className="nav-link rounded-5" to="/user/new">
            Create a New User
          </Link>
          <Link className="nav-link rounded-5" to="/user">
            User List
          </Link>
        </nav>
        <Routes>
          <Route element={<UserForm />} path="/user/new" />
          <Route element={<Main />} path="/" />
          <Route element={<UserList />} path="/user" />
          <Route element={<Details />} path="/user/:id" />
          <Route element={<Edit />} path="/user/edit/:id" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
