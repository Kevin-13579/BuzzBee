import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // your logo image
import './Navbar.css'; // use this new CSS file

export default function Navbar() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('sb_user') || '{}');

  function logout() {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    nav('/login');
  }

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Logo" />
       Buzz Bee
      </Link>

      <div className="navbar-links">
        <Link to="/home">Home</Link>
        {user && user.role === 'authority' && <Link to="/authority">Dashboard</Link>}

        {!localStorage.getItem('sb_token') ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="navbar-user">Hi, {user?.name?.split(' ')[0]}</span>
            <button onClick={logout} className="navbar-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
