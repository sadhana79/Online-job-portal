import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from './AdminDashboardLayout';
import { toast } from 'react-toastify';

export default function UpdateHrForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', contact:'', education:'' });

  useEffect(()=>{
    api.get('/admin/hr/' + id).then(r=> setForm(r.data));
  },[id]);

  const submit = async (e)=>{
    e.preventDefault();
    await api.put('/admin/hr/' + id, form);
    toast.success('HR updated');
    navigate('/admin?tab=hrs');
  };

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h3>Update HR</h3>
        <form className="row g-3" onSubmit={submit}>
          <div className="col-md-6">
            <label className="form-label fw-bold">Name</label>
            <input className="form-control" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Email</label>
            <input type="email" className="form-control" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Contact</label>
            <input className="form-control" value={form.contact||''} onChange={e=>setForm({...form,contact:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Education</label>
            <input className="form-control" value={form.education||''} onChange={e=>setForm({...form,education:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">New Password (optional)</label>
            <input type="password" className="form-control" onChange={e=>setForm({...form,password:e.target.value})} />
          </div>
          <div className="col-12">
            <button className="btn btn-primary">Update</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={()=>navigate('/admin?tab=hrs')}>Cancel</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
