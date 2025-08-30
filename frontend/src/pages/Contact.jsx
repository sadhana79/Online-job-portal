import React, { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/contacts', { name, email, message })
    toast.success('Message sent')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #89f7fe, #66a6ff)" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px", background: "linear-gradient(135deg, #ffffff, #f1f5ff)" }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>Contact Us</h2>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Message</label>
            <textarea className="form-control" rows="3" value={message} onChange={e => setMessage(e.target.value)} required />
          </div>
          <button className="btn w-100 fw-bold" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none" }}>Send</button>
        </form>
      </div>
    </div>
  )
}
