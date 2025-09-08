import React, { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import DashboardLayout from '../components/DashboardLayout'
import ApplyForm from '../components/ApplyForm'
import ProfileForm from '../components/ProfileForm'
import '../App.css';
import {
  FaLaptopCode,
  FaCog,
  FaHospitalUser,
  FaBullhorn,
  FaMoneyBillWave,
  FaBook,
  FaPaintBrush,
  FaHeadset,
  FaLaptop
} from 'react-icons/fa'

export default function UserDashboard() {
  const [tab, setTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [interviews, setInterviews] = useState([])
  const [applied, setApplied] = useState([])
  const [search, setSearch] = useState('')
  const [viewJob, setViewJob] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [me, setMe] = useState(null)

  // pagination states
  const [jobPage, setJobPage] = useState(1)
  const [interviewPage, setInterviewPage] = useState(1)
  const [appliedPage, setAppliedPage] = useState(1)
  const pageSize = 6
  

  const [selectedCategory, setSelectedCategory] = useState(null)

  const loadJobs = async () => {
    const res = await api.get('/jobs')
    setJobs(res.data || [])
  }

  const loadApplied = async () => {
    try {
      const res = await api.get('/applications/mine')
      setApplied(res.data || [])
    } catch (e) {}
  }

  const loadMe = async () => {
    try {
      const res = await api.get('/users/me')
      setMe(res.data)
    } catch (e) {}
  }

  const loadInterviews = async () => {
    try {
      const res = await api.get('/interviews/me')
      setInterviews(res.data || [])
    } catch (e) {}
  }

  useEffect(() => {
    loadJobs()
    loadInterviews()
    loadApplied()
    loadMe()
  }, [])

  const categories = [
    { name: 'Information Technology (IT) & Software', icon: <FaLaptopCode size={28} /> },
    { name: 'Engineering', icon: <FaCog size={28} /> },
    { name: 'Healthcare & Medical', icon: <FaHospitalUser size={28} /> },
    { name: 'Sales & Marketing', icon: <FaBullhorn size={28} /> },
    { name: 'Finance & Accounting', icon: <FaMoneyBillWave size={28} /> },
    { name: 'Education & Training', icon: <FaBook size={28} /> },
    { name: 'Design & Creative', icon: <FaPaintBrush size={28} /> },
    { name: 'Customer Support & BPO', icon: <FaHeadset size={28} /> },
    { name: 'Remote & Freelance', icon: <FaLaptop size={28} /> }
  ]

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    let data = jobs
    if (selectedCategory) {
      data = data.filter(j => j.category === selectedCategory)
    }
    if (!q) return data
    return data.filter(
      j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.category || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
    )
  }, [jobs, search, selectedCategory])

  
  const paginatedJobs = useMemo(() => {
    const start = (jobPage - 1) * pageSize
    return filteredJobs.slice(start, start + pageSize)
  }, [filteredJobs, jobPage])

  const paginatedApplied = useMemo(() => {
    const start = (appliedPage - 1) * pageSize
    return applied.slice(start, start + pageSize)
  }, [applied, appliedPage])

  const paginatedInterviews = useMemo(() => {
    const start = (interviewPage - 1) * pageSize
    return interviews.slice(start, start + pageSize)
  }, [interviews, interviewPage])

  const totalJobPages = Math.ceil(filteredJobs.length / pageSize)
  const totalAppliedPages = Math.ceil(applied.length / pageSize)
  const totalInterviewPages = Math.ceil(interviews.length / pageSize)

  const saveProfile = async e => {
    e.preventDefault()
    const form = new FormData(e.target)
    try {
      await api.put('/users/me', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Profile updated!')
      loadMe()
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div>
      <DashboardLayout active={tab} onTabChange={setTab}>
    
        {tab === 'interviews' && (
          <div className="card shadow-sm mb-3">
            <div className="card-body">
            <h4 className="mb-3" style={{ textAlign: 'center',color: '#11238bff',fontWeight: 'bold'}}>
  My Interviews</h4>
              <div className="table-responsive">
            
                  <table className="table table-striped align-middle custom-table-header">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Company</th>
                      <th>Job</th>
                      <th>When</th>
                      <th>Mode</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                 <tbody>
  {paginatedInterviews.length === 0 && (
    <tr>
      <td colSpan="6" className="text-center">
        No interviews scheduled yet.
      </td>
    </tr>
  )}

  {paginatedInterviews.map((i, idx) => (
    <tr key={i.id}>
      <td>{(interviewPage - 1) * pageSize + idx + 1}</td> 
      <td>{i.company_name || '—'}</td>
      <td>{i.job_title || '—'}</td>
      <td>{new Date(i.schedule_time).toLocaleString()}</td>
      <td>{i.mode}</td>
      <td>
        {i.mode === 'online' ? i.meet_link || '—' : i.address || '—'}
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>

        
              {totalInterviewPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          interviewPage === 1 ? 'disabled' : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setInterviewPage(p => Math.max(1, p - 1))
                          }
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalInterviewPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            interviewPage === i + 1 ? 'active' : ''
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setInterviewPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          interviewPage === totalInterviewPages
                            ? 'disabled'
                            : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setInterviewPage(p =>
                              Math.min(totalInterviewPages, p + 1)
                            )
                          }
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}

               <div className="mb-3" style={{ textAlign: 'center' }}>
  <h4
    className="mb-0 heading-dark-blue-center" style={{
    textAlign: 'center',    
    color: '#101e71ff',      
    fontWeight: 'bold'     
  }}
>
    
  
    {tab === 'jobs'
      ? 'Browse Jobs by Category'
      : tab === 'applied'
      ? 'Applied Jobs'
      : tab === 'profile'
      ? 'Profile'
      
      : ''}
  </h4>
</div>



    
        {tab === 'profile' && <ProfileForm />}

        
        {tab === 'jobs' && (
          <div>
            {!selectedCategory ? (
              <div className="row g-3">
                {categories.map(cat => (
                  <div className="col-md-4" key={cat.name}>
                    <div
                      className="card category-card text-center"
                      onClick={() => setSelectedCategory(cat.name)}
                      style={{
                        cursor: 'pointer',
                        minHeight: '130px',
                        background:
                          'linear-gradient(135deg, #3b82f6, #60a5fa)',
                        borderRadius: '14px',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 6px 14px rgba(0,0,0,0.15)'
                      }}
                    >
                      <div className="mb-2">{cat.icon}</div>
                      <h6 className="fw-bold px-2">{cat.name}</h6>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  className="btn btn-success mb-3"
                  onClick={() => setSelectedCategory(null)}
                  style={{ borderRadius: '20px', fontWeight: '500' }}
                >
                  ← Back to Categories
                </button>

                <div className="row g-3 mb-3">
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      placeholder="Search jobs..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ border: '2px solid #333' }}
                    />
                  </div>
                </div>
                  <br/>
                <div className="row g-3">
                  
                  {paginatedJobs.map(job => (
                    <div className="col-md-4" key={job.id}>
                      <div
                        className="card job-card-modern"
                        style={{
                          minHeight: '260px',
                          background: '#d9e2e8ff', 
                          borderRadius: '14px',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          boxShadow: '0 6px 14px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="card-body d-flex flex-column text-center">
                          <h5 className="fw-bold text-primary">{job.title}</h5>
                          <div className="small mb-2 d-flex gap-2 justify-content-center">
                            <span
                              style={{
                                background: '#19acddff',
                                color: '#f6fffcff',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {job.location}
                            </span>
                            <span
                              style={{
                                background: '#676d6eff',
                                color: '#eef5f7ff',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {job.category}
                            </span>
                          </div>

                          <div
                            className="small text-white fw-semibold px-2 py-1 rounded mb-2"
                            style={{
                              backgroundColor: '#7f9defff',
                              fontSize: '0.9rem',
                              display: 'inline-block',
                            }}
                          >
                            {job.company_name || 'Unknown Company'}
                          </div>

                          <p className="flex-grow-1">
                            {job.description?.slice(0, 100)}
                            {(job.description || '').length > 100 ? '...' : ''}
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setViewJob(job)}
                              style={{
                                borderRadius: '20px',
                                padding: '5px 12px'
                              }}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => setApplyJob(job)}
                              style={{
                                borderRadius: '20px',
                                padding: '5px 14px',
                                background:
                                  'linear-gradient(90deg,#2563eb,#1d4ed8)',
                                border: 'none'
                              }}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {paginatedJobs.length === 0 && (
                    <div className="text-center text-muted">No jobs found.</div>
                  )}
                </div>

                
                {totalJobPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            jobPage === 1 ? 'disabled' : ''
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setJobPage(p => Math.max(1, p - 1))}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalJobPages }, (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              jobPage === i + 1 ? 'active' : ''
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setJobPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            jobPage === totalJobPages ? 'disabled' : ''
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setJobPage(p => Math.min(totalJobPages, p + 1))
                            }
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        )}

    
         
        {tab === 'applied' && (
          
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              
            <div className="table-responsive">
      
              <table className="table table-striped align-middle custom-table-header">
               <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Job</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Resume</th>
                  </tr>
                </thead>
              <tbody>
  {paginatedApplied.length === 0 && (
    <tr>
      <td colSpan="5" className="text-center text-muted">
        No applications yet.
      </td>
    </tr>
  )}

  {paginatedApplied.map((a, idx) => (
    <tr key={a.application_id}>
      <td>{(appliedPage - 1) * pageSize + idx + 1}</td> {/* SR No. */}
      <td>
        <div className="fw-semibold">{a.title}</div>
        <div className="small text-muted">{a.company_name}</div>
        <div className="text-muted small">
          {a.location} • {a.category}
        </div>
      </td>
      <td>{new Date(a.created_at).toLocaleString()}</td>
      <td>
        <span
          className="badge text-uppercase"
          style={{
            backgroundColor:
              a.status === 'rejected'
                ? '#e74c3c'
                : a.status === 'applied'
                ? '#24a258ff'
                : a.status === 'scheduled'
                ? '#22bdf1ff'
                : a.status === 'shortlisted'
                ? '#ffeb3b'
                : '#95a5a6',
            color:
              a.status === 'shortlisted' || a.status === 'scheduled'
                ? 'black'
                : 'white',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '0.8rem',
          }}
        >
          {a.status}
        </span>
      </td>
      <td>
        {a.resume ? (
          <a
            className="btn btn-sm btn-outline-primary"
            href={`http://localhost:5000/uploads/resumes/${a.resume.split('/').pop()}`}
            target="_blank"
            rel="noreferrer"
            style={{ borderRadius: '20px', padding: '4px 12px' }}
          >
            Download
          </a>
        ) : (
          '—'
        )}
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>

            {totalAppliedPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        appliedPage === 1 ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setAppliedPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalAppliedPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          appliedPage === i + 1 ? 'active' : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setAppliedPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        appliedPage === totalAppliedPages ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setAppliedPage(p =>
                            Math.min(totalAppliedPages, p + 1)
                          )
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
          </div>
        )}

    
        {viewJob && (
          <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{viewJob.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewJob(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Location:</strong> {viewJob.location}
                  </p>
                  <p>
                    <strong>Category:</strong> {viewJob.category}
                  </p>
                  <p>
                    <strong>Description:</strong>
                  </p>
                  <p>{viewJob.description}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewJob(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setApplyJob(viewJob)
                      setViewJob(null)
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

    
        {applyJob && (
          <ApplyForm
            job={applyJob}
            onClose={() => setApplyJob(null)}
            onDone={loadApplied}
          />
        )}
      </DashboardLayout>
    </div>
  )
}
