import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, clearToken } from '../utils/auth'

export default function Navbar(){
  const token = getToken()
  let role = null
  if(token){ role = JSON.parse(atob(token.split('.')[1])).role }

  const nav = useNavigate()
  const logout = ()=>{ clearToken(); nav('/login') }

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark px-3 shadow-sm" 
      style={{ backgroundColor: "#2c3e50", marginBottom: "15px", borderRadius: "8px" }}
    >
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="/logo.jpg" alt="logo" width="50" height="50" className="rounded-circle shadow-sm" /> 
        
      </Link>

      <div className="ms-auto d-flex gap-3 align-items-center">
        <a className="nav-link text-white" href="/">Home</a>
        <a className="nav-link text-white" href="/about">About</a>
        <a className="nav-link text-white" href="/contact">Contact</a>

        {!token && <Link className="btn btn-outline-light" to="/login">Login</Link>}
        {!token && <Link className="btn btn-primary fw-bold" to="/register">Register</Link>}

        {role==='user' && <Link className="btn btn-outline-info" to="/user">User</Link>}
        {role==='hr' && <Link className="btn btn-outline-success" to="/hr">HR</Link>}
        {role==='admin' && <Link className="btn btn-outline-warning" to="/admin">Admin</Link>}

        {token && <button className="btn btn-danger fw-bold" onClick={logout}>Logout</button>}
      </div>
    </nav>
  )
}
