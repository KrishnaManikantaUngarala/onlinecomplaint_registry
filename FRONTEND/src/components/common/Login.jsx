import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
          <span className="navbar-brand">ComplaintCare</span>
          <div>
            <Link to="/" className="nav-link-clean me-3">Home</Link>
            <Link to="/signup" className="nav-link-clean me-3">SignUp</Link>
            <Link to="/login" className="nav-link-clean">Login</Link>
          </div>
        </div>
      </nav>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card-form p-5 shadow" style={{ width: '100%', maxWidth: 450 }}>
          <h2 className="mb-2" style={{color: 'var(--text)'}}>Login For Registering the Complaint</h2>
          <p className="small" style={{color: 'var(--text-muted)'}}>Please enter your Credentials!</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-2 input-clean"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="label-below d-block"></span>
            <input
              type="password"
              className="form-control mb-2 mt-2 input-clean"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="label-below d-block"></span>
            <div className="text-center mt-4">
              <button type="submit" className="btn-action btn-primary-action px-5">Login</button>
            </div>
          </form>
          <p className="mt-4 mb-0" style={{color: 'var(--text-muted)'}}>Don't have an account? <Link to="/signup" style={{color: 'var(--brand)'}}>SignUp</Link></p>
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
