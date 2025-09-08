import Footer from './components/Footer'
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import HRDashboard from './pages/HRDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UpdateHrForm from './components/UpdateHrForm'
import UserEdit from './components/UserEdit'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getToken } from './utils/auth'

function Protected({roles, children}){
  const token = getToken()
  if(!token) return <Navigate to="/login" />
  const payload = JSON.parse(atob(token.split('.')[1]))
  if(!roles.includes(payload.role)) return <Navigate to="/" />
  return children
}

export default function App(){
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user" element={<Protected roles={['user']}><UserDashboard /></Protected>} />
        <Route path="/hr" element={<Protected roles={['hr']}><HRDashboard /></Protected>} />
        <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
        <Route path="/admin/hr/:id/edit" element={<Protected roles={['admin']}><UpdateHrForm /></Protected>} />
        <Route path="/admin/user/:id/edit" element={<Protected roles={['admin']}><UserEdit /></Protected>} />
      </Routes>

        <Footer />
      <ToastContainer position="top-right" />
    </>
  )
}
