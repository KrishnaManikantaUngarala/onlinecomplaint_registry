import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FooterC from '../common/FooterC';

export default function HomePage({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (e) {}
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="text-white me-3">Hi, {user?.name}</span>
          <div className="d-flex align-items-center">
            <Link to="/complaint-register" className="text-white text-decoration-none me-3">Complaint Register</Link>
            <Link to="/status" className="text-white text-decoration-none me-3">Status</Link>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>LogOut</button>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 py-5">
        <div className="card-form p-5 mx-auto shadow" style={{ maxWidth: 600 }}>
          <h3 className="text-white mb-4">Welcome, {user?.name}</h3>
          <p className="text-white-50">Register a new complaint or check the status of your existing complaints.</p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/complaint-register" className="btn btn-register-cta">Register Complaint</Link>
            <Link to="/status" className="btn btn-outline-light">View Status</Link>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
}
