import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FooterC from '../common/FooterC';
import ChatWindow from '../common/ChatWindow';

export default function Status({ user, setUser }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (e) {}
  };

  useEffect(() => {
    axios.get('/my-complaints', { withCredentials: true }).then(res => {
      if (res.data.status === 'ok') setComplaints(res.data.complaints || []);
    }).catch(() => {});
  }, []);

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
        <h4 className="text-dark mb-4">My Complaints</h4>
        {complaints.length === 0 && <p className="text-muted">No complaints yet.</p>}
        {complaints.map(c => (
          <div key={c._id} className="card mb-3">
            <div className="card-body">
              <p className="mb-1"><strong>Name:</strong> {c.name} | <strong>Status:</strong> {c.status}</p>
              <p className="mb-1"><strong>Address:</strong> {c.address}, {c.city}, {c.state} - {c.pincode}</p>
              <p className="mb-2"><strong>Comment:</strong> {c.comment}</p>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedId(selectedId === c._id ? null : c._id)}>Chat with Agent</button>
              {selectedId === c._id && <div className="mt-3"><ChatWindow complaintId={c._id} user={user} /></div>}
            </div>
          </div>
        ))}
      </div>
      <FooterC />
    </div>
  );
}
