import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword(){
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [confirm,setConfirm] = useState('');
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.error('Enter valid email');
    if(newPassword!==confirm) return toast.error('Passwords do not match');
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(newPassword);
    if(!strong) return toast.error('Weak password');
    try{
      await api.post('/auth/reset', { email, newPassword });
      toast.success('Password updated. Please login.');
      nav('/login');
    }catch(e){
      toast.error(e?.response?.data?.msg || 'Failed');
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="mb-3">Reset Password</h4>
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-control" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/login">Back to login</Link>
                  <button className="btn btn-primary" type="submit">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
