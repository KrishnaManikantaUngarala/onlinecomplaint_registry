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
          <span className="me-3" style={{color: 'var(--text)', fontWeight: 600}}>Hi, {user?.name}</span>
          <div className="d-flex align-items-center">
            <Link to="/complaint-register" className="nav-link-clean me-3">Complaint Register</Link>
            <Link to="/status" className="nav-link-clean me-3">Status</Link>
            <button className="btn-action btn-danger-action" onClick={handleLogout}>LogOut</button>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 py-5">
        <div className="card-form p-5 mx-auto shadow" style={{ maxWidth: 600 }}>
          <h3 className="mb-4" style={{color: 'var(--text)'}}>Welcome, {user?.name}</h3>
          <p style={{color: 'var(--text-muted)'}}>Register a new complaint or check the status of your existing complaints.</p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/complaint-register" className="btn-action btn-primary-action">Register Complaint</Link>
            <Link to="/status" className="btn-action btn-secondary-action">View Status</Link>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
}
