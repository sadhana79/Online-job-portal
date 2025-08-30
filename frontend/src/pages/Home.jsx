import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Home(){
  const [jobs,setJobs]=useState([])
  const [q,setQ]=useState('')
  const [category,setCategory]=useState('')

  const images = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
  ]
  const [current, setCurrent] = useState(0)

  useEffect(()=>{ load() },[])
  const load = async()=>{
    const {data} = await api.get('/jobs',{ params:{ q, category }})
    setJobs(data)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="container-fluid py-3" style={{ background: "linear-gradient(135deg, #f0f4f9, #f2f2f2ff)" }}>
    
      <div 
        id="carousel" 
        className="mb-4 position-relative w-100 rounded shadow" 
        style={{ 
          height: "500px", 
          overflow: "hidden", 
          marginTop: "-20px"
        }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              opacity: idx === current ? 1 : 0,
              transition: "opacity 1s ease-in-out"
            }}>
            <img
              src={img}
              alt=""
              className="w-100 h-100"
              style={{ objectFit: "cover", filter: "brightness(60%)" }} 
            />
      
            <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
              <h2 className="fw-bold display-5" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}>
                Explore Your Dream Career
              </h2>
              <Link to="/login" 
                className="btn btn-light btn-lg mt-3 shadow fw-semibold apply-btn">
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h1 className="fw-bold text-center mb-4">🎯 Find your next job</h1>

      <div className="text-center mb-5">
        <div className="d-flex justify-content-center gap-2">
          <input className="form-control w-25" placeholder="Search by title or desc" value={q} onChange={e=>setQ(e.target.value)}/>
          <select className="form-select w-25" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option>python</option>
            <option>java</option>
            <option>frontend</option>
            <option>backend</option>
          </select>
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
      </div>

      <div className="row justify-content-center">
        {jobs.slice(0,6).map(j=>(
          <div className="col-md-5 col-lg-4 mb-4" key={j.id}>
            <div 
              className="card job-card shadow-sm" 
              style={{ 
                background: "linear-gradient(135deg, #88b6e3ff, #dbeafe)", 
                minHeight: "260px", 
                maxWidth: "95%",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary">{j.title}</h5>
                <p className="card-text text-muted">{j.description?.slice(0,100)}...</p>
                <span className="badge text-bg-secondary me-2">{j.category}</span>
                <span className="badge text-bg-info">{j.location}</span>
                <div className="mt-3 text-center">
                  <Link to="/login" className="btn btn-primary px-4 apply-btn">
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.25) !important;
        }
        .apply-btn {
          transition: all 0.3s ease;
        }
        .apply-btn:hover {
          background-color: #0d47a1 !important;
          color: #fff !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
