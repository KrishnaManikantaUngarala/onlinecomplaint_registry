import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AgentInfo() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    axios.get('/admin/agents', { withCredentials: true }).then(res => {
      if (res.data.status === 'ok') setAgents(res.data.agents || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      <h5 className="mb-3">Agents</h5>
      {agents.length === 0 && <p className="text-muted">No agents.</p>}
      <div className="list-group">
        {agents.map(a => (
          <div key={a._id} className="list-group-item">
            <strong>{a.name}</strong> - {a.email} - {a.phone}
          </div>
        ))}
      </div>
    </div>
  );
}
