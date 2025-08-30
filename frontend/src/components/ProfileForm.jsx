import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function ProfileForm(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [contact,setContact]=useState('');
  const [education,setEducation]=useState('');
  const [college,setCollege]=useState('');
  const [experience,setExperience]=useState('');
  const [skills,setSkills]=useState('');
  const [avatar,setAvatar]=useState(null);
  const [me,setMe]=useState(null);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    api.get('/users/me').then(r=>{
      setMe(r.data);
      const u = r.data || {};
      setName(u.name||''); setEmail(u.email||''); setContact(u.contact||'');
      setEducation(u.education||''); setCollege(u.college||''); setExperience(u.experience||''); setSkills(u.skills||'');
    });
  },[]);

  const submit = async (e)=>{
    e.preventDefault();
    if(contact && !/^\d{10}$/.test(contact)) return toast.error('Contact must be 10 digits');
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('contact', contact);
    form.append('education', education);
    form.append('college', college);
    form.append('experience', experience);
    form.append('skills', skills);
    if(avatar) form.append('avatar', avatar);
    try{
      setSaving(true);
      await api.post('/users/me', form, { headers: {'Content-Type':'multipart/form-data'} });
      toast.success('Profile updated');
    }catch(e){
      toast.error(e?.response?.data?.msg || 'Failed');
    }finally{
      setSaving(false);
    }
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img src={(me?.avatar)||'/assets/default-avatar.png'} alt="avatar" width="64" height="64" style={{borderRadius:'50%',objectFit:'cover'}} onError={(ev)=>{ev.currentTarget.src='/assets/default-avatar.png'}} />
          <div className="ms-3">
            <div className="fw-semibold">{me?.name}</div>
            <div className="text-muted small">{me?.email}</div>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contact</label>
              <input className="form-control" value={contact} onChange={e=>setContact(e.target.value)} placeholder="10-digit mobile" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Education</label>
              <input className="form-control" value={education} onChange={e=>setEducation(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">College</label>
              <input className="form-control" value={college} onChange={e=>setCollege(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Experience</label>
              <input className="form-control" value={experience} onChange={e=>setExperience(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Skills</label>
              <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node, SQL" />
            </div>
            <div className="col-12">
              <label className="form-label">Profile Photo</label>
              <input className="form-control" type="file" onChange={e=>setAvatar(e.target.files[0])} accept="image/*" />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
