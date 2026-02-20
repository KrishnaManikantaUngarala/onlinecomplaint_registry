import axios from 'axios';
import { useState } from 'react';

export default function Complaint({ user }) {
    const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '', comment: '', status: 'pending' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/submit-complaint', { ...form, userId: user._id });
        alert("Complaint Registered!");
    };

    return (
        <div className="vh-100 bg-secondary p-5">
            <div className="container bg-dark text-white p-5 rounded">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label>Name</label>
                        <input className="form-control" onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label>Address</label>
                        <input className="form-control" onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                    <div className="col-md-12 text-center mt-4">
                        <button onClick={handleSubmit} className="btn btn-success px-5">Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}