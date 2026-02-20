import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp({ setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', userType: 'customer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/register', form, { withCredentials: true });
      if (res.data.status === 'ok') {
        setUser(res.data.user);
        if (res.data.user.userType === 'admin') navigate('/admin-dashboard');
        else if (res.data.user.userType === 'agent') navigate('/agent-dashboard');
        else navigate('/user-dashboard');
      } else {
        setError(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      const isNetwork = err.message === 'Network Error' || err.code === 'ERR_NETWORK';
      setError(isNetwork ? 'Cannot reach server. Start the backend: cd BACKEND then npm start' : msg);
    } finally {
      setLoading(false);
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
          <h2 className="mb-2" style={{color: 'var(--text)'}}>SignUp For Registering the Complaint</h2>
          <p className="small" style={{color: 'var(--text-muted)'}}>Please enter your Details</p>
          {error && <div className="alert alert-warning py-2 small">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-2 input-clean" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input type="email" className="form-control mb-2 input-clean" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input type="password" className="form-control mb-2 input-clean" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <input className="form-control mb-2 input-clean" placeholder="Mobile No." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
      
            <span className="label-below d-block small"></span>
            <div className="text-center mt-4">
              <button type="submit" className="btn-action btn-primary-action px-5" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          <p className="mt-4 mb-0" style={{color: 'var(--text-muted)'}}>Had an account? <Link to="/login" style={{color: 'var(--brand)'}}>Login</Link></p>
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
