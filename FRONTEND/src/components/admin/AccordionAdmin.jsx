import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccordionAdmin({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [openComplaints, setOpenComplaints] = useState(true);
  const [openAgents, setOpenAgents] = useState(true);
  const [statusValues, setStatusValues] = useState({});

  const refreshComplaints = () =>
    axios.get('/admin/complaints', { withCredentials: true })
      .then(res => { if (res.data.status === 'ok') setComplaints(res.data.complaints || []); });

  const refreshAgents = () =>
    axios.get('/admin/agents', { withCredentials: true })
      .then(res => { if (res.data.status === 'ok') setAgents(res.data.agents || []); });

  useEffect(() => {
    refreshComplaints().catch(() => {});
    refreshAgents().catch(() => {});
  }, []);

  const assignToAgent = async (complaintId, agentId) => {
    setAssigning(complaintId);
    try {
      const res = await axios.post(
        '/admin/assign-complaint',
        { complaintId, agentId },
        { withCredentials: true, timeout: 10000 }
      );
      setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: 'assigned' } : c));
      const agentName = res.data?.assigned?.agentName;
      alert(agentName ? `Assigned to ${agentName}` : 'Assigned successfully');
      await refreshComplaints();
    } catch (e) {
      alert(e.response?.data?.message || 'Assign failed');
    } finally {
      setAssigning(null);
    }
  };

  const updateStatus = async (complaintId) => {
    const value = (statusValues[complaintId] || '').trim();
    if (!value) return;
    try {
      await axios.put(`/admin/complaint-status/${complaintId}`, { status: value }, { withCredentials: true });
      setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: value } : c));
      setStatusValues(prev => ({ ...prev, [complaintId]: '' }));
    } catch (e) {
      alert('Status update failed');
    }
  };

  return (
    <div className="container py-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center bg-light" style={{ cursor: 'pointer' }} onClick={() => setOpenComplaints(!openComplaints)}>
          <span>Users Complaints</span>
          <span>{openComplaints ? '▼' : '▶'}</span>
        </div>
        {openComplaints && (
          <div className="card-body">
            {complaints.length === 0 && <p className="text-muted mb-0">No complaints.</p>}
            {complaints.map(c => (
              <div key={c._id} className="border rounded p-3 mb-3">
                <p className="mb-1"><strong>Name:</strong> {c.name}</p>
                <p className="mb-1"><strong>Address:</strong> {c.address}</p>
                <p className="mb-1"><strong>City:</strong> {c.city} <strong>State:</strong> {c.state} <strong>Pincode:</strong> {c.pincode}</p>
                <p className="mb-1"><strong>Comment:</strong> {c.comment}</p>
                <p className="mb-2"><strong>Status:</strong> {c.status}</p>
                <div className="row g-2 align-items-center mb-2">
                  <div className="col-md-8">
                    <input
                      className="form-control form-control-sm"
                      placeholder="New status (e.g. in progress, resolved)"
                      value={statusValues[c._id] || ''}
                      onChange={e => setStatusValues(prev => ({ ...prev, [c._id]: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-4 d-grid">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => updateStatus(c._id)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" disabled={assigning === c._id}>
                    {assigning === c._id ? 'Assigning...' : 'Assign'}
                  </button>
                  <ul className="dropdown-menu">
                    {agents.length === 0 && <li className="dropdown-item text-muted">No Agents to show</li>}
                    {agents.map(a => (
                      <li key={a._id}><button className="dropdown-item" onClick={() => assignToAgent(c._id, a._id)}>{a.name} ({a.email})</button></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center bg-light" style={{ cursor: 'pointer' }} onClick={() => setOpenAgents(!openAgents)}>
          <span>Agents</span>
          <span>{openAgents ? '▼' : '▶'}</span>
        </div>
        {openAgents && (
          <div className="card-body">
            {agents.length === 0 && <div className="p-3 bg-info bg-opacity-25 rounded">No Agents to show</div>}
            {agents.map(a => (
              <div key={a._id} className="border rounded p-2 mb-2">{a.name} - {a.email}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
