import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', { email, password });
            if (res.data.status === 'ok') {
                setUser(res.data.user);
                if (res.data.user.userType === 'admin') navigate('/admin-dashboard');
                else if (res.data.user.userType === 'agent') navigate('/agent-dashboard');
                else navigate('/user-dashboard');
            }
        } catch (err) { alert("Login failed"); }
    };

    return (
        <div className="vh-100 bg-secondary d-flex justify-content-center align-items-center">
            <div className="bg-dark p-5 text-white rounded text-center shadow" style={{width: '450px'}}>
                <h2 className="mb-4">Login For Registering the Complaint</h2>
                <p>Please enter your Credentials!</p>
                <form onSubmit={handleLogin}>
                    <input className="form-control mb-3" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                    <input className="form-control mb-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                    <button className="btn btn-outline-light w-50 mb-3">Login</button>
                </form>
                <p>Don't have an account? <Link to="/signup" className="text-primary">SignUp</Link></p>
            </div>
        </div>
    );
}