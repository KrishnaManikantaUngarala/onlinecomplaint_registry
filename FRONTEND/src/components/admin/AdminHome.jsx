import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FooterC from '../common/FooterC';
import AccordionAdmin from './AccordionAdmin';
import UserInfo from './UserInfo';
import AgentInfo from './AgentInfo';

export default function AdminHome({ user, setUser }) {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('dashboard');

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (e) {}
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <nav className="navbar nav-dark">
        <div className="container-fluid">
          <span className="text-white me-3">Hi Admin {user?.name},</span>
          <div className="d-flex align-items-center">
            <button className="btn btn-link nav-link-clean me-2 p-0" onClick={() => setTab('dashboard')}>Dashboard</button>
            <button className="btn btn-link nav-link-clean me-2 p-0" onClick={() => setTab('user')}>User</button>
            <button className="btn btn-link nav-link-clean me-2 p-0" onClick={() => setTab('agent')}>Agent</button>
            <button className="btn-action btn-danger-action ms-2" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>
      <div className="flex-grow-1">
        {tab === 'dashboard' && <AccordionAdmin user={user} />}
        {tab === 'user' && <UserInfo />}
        {tab === 'agent' && <AgentInfo />}
      </div>
      <FooterC />
    </div>
  );
}
