import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChatWindow({ complaintId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const load = () => {
    axios.get(`/chat/${complaintId}`, { withCredentials: true }).then(res => {
      if (res.data.status === 'ok') setMessages(res.data.messages || []);
    }).catch(() => {});
  };

  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [complaintId]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    axios.post('/chat/send', { complaintId, message: text }, { withCredentials: true }).then(() => {
      setText('');
      load();
    }).catch(() => {});
  };

  return (
    <div className="border rounded p-3 bg-light">
      <h6 className="mb-3">💬 Chat with {user?.userType === 'agent' ? 'Customer' : 'Agent'}</h6>
      <div className="mb-3 p-2 bg-white rounded" style={{ maxHeight: 250, overflowY: 'auto', minHeight: 100 }}>
        {messages.length === 0 && <p className="text-muted small mb-0">No messages yet. Start the conversation!</p>}
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 p-2 rounded ${m.name === user?.name ? 'bg-primary bg-opacity-10 ms-4' : 'bg-secondary bg-opacity-10 me-4'}`}>
            <strong className="text-primary">{m.name}:</strong> <span>{m.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="d-flex gap-2">
        <input className="form-control input-clean" placeholder="Type your message..." value={text} onChange={e => setText(e.target.value)} />
        <button type="submit" className="btn-action btn-success-action">Send</button>
      </form>
    </div>
  );
}
