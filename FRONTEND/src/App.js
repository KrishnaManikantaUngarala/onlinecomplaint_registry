import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';
import About from './components/common/About';
import HomePage from './components/user/HomePage';
import Complaint from './components/user/Complaint';
import Status from './components/user/Status';
import AdminHome from './components/admin/AdminHome';
import AgentHome from './components/agent/AgentHome';

function PrivateRoute({ user, allowedTypes, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedTypes && !allowedTypes.includes(user.userType)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/me', { withCredentials: true })
      .then(res => { if (res.data.status === 'ok') setUser(res.data.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to={user.userType === 'admin' ? '/admin-dashboard' : user.userType === 'agent' ? '/agent-dashboard' : '/user-dashboard'} replace /> : <Login setUser={setUser} />} />
      <Route path="/signup" element={<SignUp setUser={setUser} />} />
      <Route path="/about" element={<About />} />
      <Route path="/user-dashboard" element={<PrivateRoute user={user} allowedTypes={['customer']}><HomePage user={user} setUser={setUser} /></PrivateRoute>} />
      <Route path="/complaint-register" element={<PrivateRoute user={user} allowedTypes={['customer']}><Complaint user={user} setUser={setUser} /></PrivateRoute>} />
      <Route path="/status" element={<PrivateRoute user={user} allowedTypes={['customer']}><Status user={user} setUser={setUser} /></PrivateRoute>} />
      <Route path="/admin-dashboard" element={<PrivateRoute user={user} allowedTypes={['admin']}><AdminHome user={user} setUser={setUser} /></PrivateRoute>} />
      <Route path="/agent-dashboard" element={<PrivateRoute user={user} allowedTypes={['agent']}><AgentHome user={user} setUser={setUser} /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
