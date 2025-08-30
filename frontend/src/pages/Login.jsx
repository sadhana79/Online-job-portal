import React, { useState } from 'react'
import api from '../services/api'
import { saveToken } from '../utils/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveToken(data.token)
      toast.success('Logged in')
      const role = JSON.parse(atob(data.token.split('.')[1])).role
      nav(role === 'admin' ? '/admin' : role === 'hr' ? '/hr' : '/user')
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89f7fe, #66a6ff) " }}
    >
      <div 
        className="card shadow-lg border-0" 
        style={{ 
          maxWidth: 450, 
          width: "100%", 
          borderRadius: "15px", 
          background: "#ffffffcc"
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <img src="/reglogo.png" width="80" alt="Logo" />
          </div>
        
          <h3 className="text-center mb-3 fw-bold text-primary">Sign In</h3>

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
                SIGN IN
              </button>
              <div className="mt-3 text-center"><a href="/forgot">Forgot password?</a></div>
           </div>

          </form>
        </div>
      </div>
    </div>
  )
}