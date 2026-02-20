import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FooterC from '../common/FooterC';

export default function Complaint({ user, setUser }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '', comment: '', status: 'type pending' });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/submit-complaint', {
        name: form.name,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        comment: form.comment
      }, { withCredentials: true });
      alert('Complaint Registered!');
      setForm({ name: '', address: '', city: '', state: '', pincode: '', comment: '', status: 'type pending' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register complaint');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="text-white me-3">Hi, {user?.name}</span>
          <div className="d-flex align-items-center">
            <Link to="/complaint-register" className="nav-link-clean me-3">Complaint Register</Link>
            <Link to="/status" className="nav-link-clean me-3">Status</Link>
            <button className="btn-action btn-danger-action" onClick={handleLogout}>LogOut</button>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 py-5">
        <div className="card-form p-5 mx-auto shadow" style={{ maxWidth: 700 }}>
          <h3 className="text-white mb-4">Complaint Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <input className="form-control input-clean" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <span className="label-below text-white-50">Name</span>
              </div>
              <div className="col-12">
                <input className="form-control input-clean" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                <span className="label-below text-white-50">Address</span>
              </div>
              <div className="col-md-6">
                <input className="form-control input-clean" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                <span className="label-below text-white-50">City</span>
              </div>
              <div className="col-md-6">
                <input className="form-control input-clean" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
                <span className="label-below text-white-50">State</span>
              </div>
              <div className="col-md-6">
                <input className="form-control input-clean" placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                <span className="label-below text-white-50">Pincode</span>
              </div>
              <div className="col-md-6">
                <input className="form-control input-clean" placeholder="Status" value={form.status} readOnly />
                <span className="label-below text-white-50">Status</span>
              </div>
              <div className="col-12">
                <textarea className="form-control textarea-clean" rows={4} placeholder="Description" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} required />
                <span className="label-below text-white-50">Description</span>
              </div>
              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn-action btn-primary-action px-5">Register Complaint</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <FooterC />
    </div>
  );
}
