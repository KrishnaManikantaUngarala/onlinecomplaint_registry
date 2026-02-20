import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password }, { withCredentials: true });
      if (res.data.status === 'ok') {
        setUser(res.data.user);
        if (res.data.user.userType === 'admin') navigate('/admin-dashboard');
        else if (res.data.user.userType === 'agent') navigate('/agent-dashboard');
        else navigate('/user-dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

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
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card-form p-5 shadow" style={{ width: '100%', maxWidth: 450 }}>
          <h2 className="text-white mb-2">Login For Registering the Complaint</h2>
          <p className="text-white-50 small">Please enter your Credentials!</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-2 bg-white"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="label-below d-block text-white-50">Email</span>
            <input
              type="password"
              className="form-control mb-2 mt-2 bg-white"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="label-below d-block text-white-50">Password</span>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-outline-light px-4">Login</button>
            </div>
          </form>
          <p className="text-white-50 mt-4 mb-0">Don't have an account? <Link to="/signup" className="text-primary">SignUp</Link></p>
        </div>
      </div>
      <FooterC />
    </div>
  );
}

function FooterC() {
  return (
    <footer className="footer-dark" />
  );
}
