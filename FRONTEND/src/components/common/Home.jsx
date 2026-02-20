import React from 'react';
import { Link } from 'react-router-dom';
import FooterC from './FooterC';

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="navbar-brand text-white">ComplaintCare</span>
          <div>
            <Link to="/" className="nav-link-clean me-3">Home</Link>
            <Link to="/signup" className="nav-link-clean me-3">SignUp</Link>
            <Link to="/login" className="nav-link-clean">Login</Link>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 d-flex align-items-center py-5">
        <div className="row w-100 align-items-center">
          <div className="col-lg-6 text-center">
            <div className="hero-chip mb-3">ResolveNow • ComplaintCare</div>
            <div className="rounded-circle d-inline-block p-4 mb-3" style={{ width: 280, height: 280, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <span className="display-4">📋</span>
                <span className="mt-2 page-subtitle">Support</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h1 className="fw-bold page-title mb-2">Empower Your Team,</h1>
            <h2 className="h5 page-subtitle mb-4">Exceed Customer Expectations: Discover our Complaint Management Solution</h2>
            <Link to="/signup" className="btn-action btn-primary-action">Register your Complaint</Link>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
}
