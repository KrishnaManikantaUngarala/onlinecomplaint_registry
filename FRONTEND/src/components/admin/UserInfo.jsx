import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserInfo() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/admin/users', { withCredentials: true }).then(res => {
      if (res.data.status === 'ok') setUsers(res.data.users || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      <h5 className="mb-3">Users</h5>
      {users.length === 0 && <p className="text-muted">No users.</p>}
      <div className="list-group">
        {users.map(u => (
          <div key={u._id} className="list-group-item">
            <strong>{u.name}</strong> - {u.email} - {u.phone}
          </div>
        ))}
      </div>
    </div>
  );
}
