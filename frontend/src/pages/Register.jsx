import React, { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [contact,setContact]=useState('')
  const [education,setEducation]=useState('')
  const [college,setCollege]=useState('')
  const [experience,setExperience]=useState('')
  const [skills,setSkills]=useState('')
  const nav = useNavigate()

  const submit = async(e)=>{
    e.preventDefault()
    const passOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(password)
    if(name.length<3) return toast.error('Name min 3')
    if(!passOk) return toast.error('Password needs upper,lower,digit,symbol,6+')
    if(contact && !/^\d{10}$/.test(contact)) return toast.error('Contact must be 10 digits')
    try{
      await api.post('/auth/register',{name,email,password,contact,education,college,experience,skills})
      toast.success('Registered, login now')
      nav('/login')
    }catch(e){ toast.error(e.response?.data?.msg || 'Register failed') }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" 
         style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89f7fe, #66a6ff)" }}>
      <div className="card shadow-lg p-4" 
           style={{ width: "100%", maxWidth: "450px", borderRadius: "15px", background: "linear-gradient(135deg, #c4daf1 0%, #f9f9f9 100%)" }}>
        <div className="text-center mb-3">
          <img src="/reglogo.png" alt="Register Logo" width="100" className="mb-2" />
          <h3 className="fw-bold text-primary">Sign Up</h3>
        </div>

        <form onSubmit={submit} className="mt-3">
          <input 
            className="form-control mb-3" 
            placeholder="Name" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            required
          />
          <input 
            className="form-control mb-3" 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          <input 
            className="form-control mb-3" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
          />
          <div className="d-flex justify-content-center">
            <button 
              className="btn w-50 fw-bold" 
              style={{ 
                background: "linear-gradient(90deg, #007bff, #00c6ff)", 
                color: "#fff", 
                border: "none", 
                borderRadius: "8px" 
              }}
            >
              SIGN UP
            </button>
          </div>
        
<div className="row g-3 mt-2">
  <div className="col-md-6">
    <label className="form-label">Contact</label>
    <input className="form-control" value={contact} onChange={e=>setContact(e.target.value)} placeholder="10-digit mobile" />
  </div>
  <div className="col-md-6">
    <label className="form-label">Education</label>
    <input className="form-control" value={education} onChange={e=>setEducation(e.target.value)} placeholder="e.g. B.Tech (CSE)" />
  </div>
  <div className="col-md-6">
    <label className="form-label">College</label>
    <input className="form-control" value={college} onChange={e=>setCollege(e.target.value)} placeholder="Your college" />
  </div>
  <div className="col-md-6">
    <label className="form-label">Experience</label>
    <input className="form-control" value={experience} onChange={e=>setExperience(e.target.value)} placeholder="e.g. 2 years" />
  </div>
  <div className="col-12">
    <label className="form-label">Skills</label>
    <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node, SQL" />
  </div>
</div>

    </form>
      </div>
    </div>
  )
}