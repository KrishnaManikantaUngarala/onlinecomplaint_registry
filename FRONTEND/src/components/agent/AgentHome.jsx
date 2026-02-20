import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FooterC from '../common/FooterC';
import ChatWindow from '../common/ChatWindow';

export default function AgentHome({ user, setUser }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [statusVal, setStatusVal] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (e) {}
  };

  useEffect(() => {
    axios.get('/agent/complaints', { withCredentials: true }).then(res => {
      if (res.data.status === 'ok') setComplaints(res.data.complaints || []);
    }).catch(() => {});
  }, []);

  const updateStatus = async (complaintId) => {
    if (!statusVal.trim()) return;
    try {
      await axios.put(`/agent/complaint-status/${complaintId}`, { status: statusVal }, { withCredentials: true });
      setComplaints(prev => prev.map(ac => ac.complaintId._id === complaintId ? { ...ac, complaintId: { ...ac.complaintId, status: statusVal } } : ac));
      setStatusVal('');
    } catch (e) {
      alert('Update failed');
    }
  };

  const currentComplaint = selectedId ? complaints.find(ac => ac.complaintId?._id === selectedId) : complaints[0];
  const c = currentComplaint?.complaintId;

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="text-white me-3">Hi Agent {user?.name}</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">View Complaints</span>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>
      <div className="container flex-grow-1 py-5">
        <div className="row">
          <div className="col-lg-6">
            {complaints.length === 0 && (
              <div className="card">
                <div className="card-body text-muted">No complaints assigned.</div>
              </div>
            )}
            {complaints.map(ac => {
              const comp = ac.complaintId;
              if (!comp) return null;
              const isSelected = selectedId === comp._id || (!selectedId && ac === complaints[0]);
              return (
                <div key={comp._id} className="card mb-3">
                  <div className="card-body">
                    <p className="mb-1"><strong>Name:</strong> {comp.name}</p>
                    <p className="mb-1"><strong>Address:</strong> {comp.address}</p>
                    <p className="mb-1"><strong>City:</strong> {comp.city} <strong>State:</strong> {comp.state} <strong>Pincode:</strong> {comp.pincode}</p>
                    <p className="mb-1"><strong>Comment:</strong> {comp.comment}</p>
                    <p className="mb-2"><strong>Status:</strong> {comp.status}</p>
                    <div className="d-flex gap-2 mb-2">
                      <input className="form-control form-control-sm" placeholder="New status" value={isSelected ? statusVal : ''} onChange={e => setStatusVal(e.target.value)} onFocus={() => setSelectedId(comp._id)} />
                      <button className="btn btn-primary btn-sm" onClick={() => updateStatus(comp._id)}>Status Change</button>
                    </div>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => { setSelectedId(comp._id); setStatusVal(''); }}>Message</button>
                    {isSelected && (
                      <div className="mt-3">
                        <ChatWindow complaintId={comp._id} user={user} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
}
