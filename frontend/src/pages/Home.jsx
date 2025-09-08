import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import { 
  FaLaptopCode, FaCog, FaHospitalUser, FaBullhorn, 
  FaMoneyBillWave, FaBook, FaPaintBrush, FaHeadset, FaLaptop 
} from 'react-icons/fa'

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [showAllCategories, setShowAllCategories] = useState(false)

  const images = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
  ]
  const [current, setCurrent] = useState(0)

  useEffect(() => { load() }, [category])
  const load = async () => {
    const { data } = await api.get('/jobs', { params: { q, category } })
    setJobs(data)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  const categories = [
    { name: "Information Technology (IT) & Software", icon: <FaLaptopCode size={50} /> },
    { name: "Engineering", icon: <FaCog size={50} /> },
    { name: "Healthcare & Medical", icon: <FaHospitalUser size={50} /> },
    { name: "Sales & Marketing", icon: <FaBullhorn size={50} /> },
    { name: "Finance & Accounting", icon: <FaMoneyBillWave size={50} /> },
    { name: "Education & Training", icon: <FaBook size={50} /> },
    { name: "Design & Creative", icon: <FaPaintBrush size={50} /> },
    { name: "Customer Support & BPO", icon: <FaHeadset size={50} /> },
    { name: "Remote & Freelance", icon: <FaLaptop size={50} /> },
  ]

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4)

  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
    
      <div
        className="position-relative w-100"
        style={{
          height: "550px",
          overflow: "hidden",
          borderRadius: "0 0 20px 20px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              opacity: idx === current ? 1 : 0,
              transition: "opacity 1.2s ease-in-out"
            }}
          >
            <img
              src={img}
              alt="career"
              className="w-100 h-100"
              style={{ objectFit: "cover", filter: "brightness(55%)" }}
            />
            <div className="position-absolute top-50 start-50 translate-middle text-center text-white px-3">
              <h1 className="fw-bold display-4" style={{ textShadow: "3px 3px 10px rgba(0,0,0,0.7)" }}>
                Find Your Next Career Move
              </h1>
              <p className="lead mb-4" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.6)" }}>
                Explore thousands of opportunities from top companies
              </p>
              <Link
                to="/login"
                className="btn btn-primary btn-lg fw-semibold"
                style={{
                  borderRadius: "30px",
                  padding: "10px 30px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>

    
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-5 category-heading">
          Browse by Categories
        </h2>
        <div className="row text-center justify-content-center">
          {displayedCategories.map((cat, idx) => (
            <div key={idx} className="col-md-6 col-lg-3 mb-4">
              <div
                className="p-5 h-100 shadow-lg rounded category-card"
                onClick={() => setCategory(cat.name)}
              >
                <div className="mb-3 text-primary">{cat.icon}</div>
                <h6 className="fw-bold">{cat.name}</h6>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowAllCategories(!showAllCategories)}  >
            {showAllCategories ? "Show Less" : "View More"}
          </button>
        </div>
      </div>

      
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-5 job-heading">
          Latest Jobs
        </h2>
        <div className="row justify-content-center">
         {jobs.slice(0, 6).map(j => (
  <div className="col-md-5 col-lg-4 mb-4" key={j.id}>
    <div className="card shadow-sm border-0 h-100 job-card">
      <div className="card-body d-flex flex-column">
        <h5 className="fw-bold text-primary">{j.title}</h5>
        <h6 className="text-secondary mb-2">{j.companyName}</h6> {/* Added company name */}
        <p className="text-muted flex-grow-1">{j.description?.slice(0, 100)}...</p>
        <div className="mb-2">
          <span className="badge bg-secondary me-2">{j.category}</span>
          <span className="badge bg-info me-2">{j.location}</span>
          <span className="badge bg-success">{j.type || "Full-time"}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="fw-bold text-dark">{j.salary || "Not Disclosed"}</small>
          <Link
            to="/login"
            className="btn btn-outline-primary fw-semibold"
            style={{
              borderRadius: "25px",
              padding: "8px 20px",
              transition: "all 0.3s ease"
            }}
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  </div>
))}
          {jobs.length === 0 && (
            <p className="text-center text-muted">No jobs found.</p>
          )}
        </div>
      </div>

      <style>{`
        /* Headings style */
        .category-heading, .job-heading {
          background: linear-gradient(90deg, #37dbedff, #3238dbff);
          display: inline-block;
          padding: 12px 25px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          color: white;
        }
        .container h2 {
          text-align: center;
        }

        /* Category cards */
        .category-card {
          background: linear-gradient(135deg, #a99604ff, #fff79cff);
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 1.1rem;
          border-radius: 20px;
        }
        .category-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 12px 25px rgba(0,0,0,0.25);
        }

        /* Job cards */
        .job-card {
          background: linear-gradient(135deg, #799bd6ff, #c9d7f1ff);
          border-radius: 18px;
          transition: all 0.3s ease;
          height:200px;
          width:400px;
      

        }
        .job-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25) !important;
        }

        /* Buttons hover */
        .btn-outline-primary:hover {
          background: #2563eb !important;
          color: #fff !important;
          box-shadow: 0 6px 16px rgba(37,99,235,0.5);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
