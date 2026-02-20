import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="navbar-brand text-white">ComplaintCare</span>
          <div>
            <Link to="/" className="text-white text-decoration-none me-3">Home</Link>
            <Link to="/signup" className="text-white text-decoration-none me-3">SignUp</Link>
            <Link to="/login" className="text-white text-decoration-none">Login</Link>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 py-5">
        <h1 className="mb-4">About ComplaintCare</h1>
        <p>ResolveNow is your platform for online complaints. We help you submit, track, and resolve issues efficiently with support from our agents.</p>
      </div>
      <footer className="footer-dark" />
    </div>
  );
}
