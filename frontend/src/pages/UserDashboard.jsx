import React, { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import DashboardLayout from '../components/DashboardLayout'
import ApplyForm from '../components/ApplyForm'
import ProfileForm from '../components/ProfileForm'

export default function UserDashboard(){
  const [tab,setTab]=useState('jobs')
  const [jobs,setJobs]=useState([])
  const [applied,setApplied]=useState([])
  const [search,setSearch]=useState('')
  const [viewJob,setViewJob]=useState(null)
  const [applyJob,setApplyJob]=useState(null)
  const [me,setMe]=useState(null)


  const [page,setPage]=useState(1)
  const pageSize=5

  const loadJobs = async ()=>{ const res = await api.get('/jobs'); setJobs(res.data||[]) }
  const loadApplied = async ()=>{ try{ const res = await api.get('/applications/mine'); setApplied(res.data||[]) }catch(e){} }
  const loadMe = async ()=>{ try{ const res = await api.get('/users/me'); setMe(res.data) }catch(e){} }

  useEffect(()=>{ loadJobs(); loadApplied(); loadMe(); },[])

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase()
    if(!q) return jobs
    return jobs.filter(j =>
      (j.title||'').toLowerCase().includes(q) ||
      (j.category||'').toLowerCase().includes(q) ||
      (j.location||'').toLowerCase().includes(q)
    )
  },[jobs,search])

  const paginatedApplied = useMemo(()=>{
    const start=(page-1)*pageSize
    return applied.slice(start,start+pageSize)
  },[applied,page])

  const totalPages=Math.ceil(applied.length/pageSize)

  const saveProfile=async(e)=>{
    e.preventDefault()
    const form=new FormData(e.target)
    try{
      await api.put('/users/me',form,{headers:{'Content-Type':'multipart/form-data'}})
      toast.success('Profile updated!')
      loadMe()
    }catch(err){ toast.error('Failed to update profile') }
  }

  return (
    <DashboardLayout active={tab} onTabChange={setTab}>
      <div className="mb-3">
        <h4 className="mb-0">{tab==='jobs' ? 'Jobs' : tab==='applied' ? 'Applied Jobs' : 'Profile'}</h4>
      </div>

      
      {tab==='profile' && (<ProfileForm />)}

      {tab==='jobs' && (
        <div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <input className="form-control" placeholder="Search jobs..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>
          <div className="row g-3">
            {filtered.map(job => (
              <div className="col-md-4" key={job.id}>
                <div 
                  className="card shadow-sm border-0 job-card"
                  style={{
                    minHeight: "240px",
                    background: "linear-gradient(135deg, #e6f0fa, #f8fbff)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-semibold">{job.title}</h5>
                    <div className="text-muted small mb-2">{job.location} • {job.category}</div>
                    <p className="flex-grow-1">{job.description?.slice(0,120)}{(job.description||'').length>120?'...':''}</p>
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-outline-secondary btn-sm" onClick={()=>setViewJob(job)}>View</button>
                      <button className="btn btn-primary btn-sm" onClick={()=>setApplyJob(job)}>Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <style>
            {`
              .job-card:hover {
                transform: translateY(-6px) scale(1.02);
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                background: linear-gradient(135deg, #dceeff, #f0f7ff);
              }
            `}
          </style>
        </div>
      )}

      
      {tab==='applied' && (
        <div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplied.map(a=>(
                  <tr key={a.application_id}>
                    <td>
                      <div className="fw-semibold">{a.title}</div>
                      <div className="text-muted small">{a.location} • {a.category}</div>
                    </td>
                    <td>{new Date(a.created_at).toLocaleString()}</td>
                    <td>
                      <span className={`badge text-uppercase ${a.status==='rejected'?'bg-danger':a.status==='applied'?'bg-success':'bg-secondary'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.resume ? <a className="btn btn-sm btn-outline-primary" href={`http://localhost:5000/${a.resume}`} target="_blank" rel="noreferrer">Download</a> : '—'}</td>
                  </tr>
                ))}
                {applied.length===0 && (
                  <tr><td colSpan="4" className="text-center text-muted">No applications yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages>1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${page===1?'disabled':''}`}>
                    <button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
                  </li>
                  {Array.from({length:totalPages},(_,i)=>(
                    <li key={i} className={`page-item ${page===i+1?'active':''}`}>
                      <button className="page-link" onClick={()=>setPage(i+1)}>{i+1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page===totalPages?'disabled':''}`}>
                    <button className="page-link" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

  
      

      
      {viewJob && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewJob.title}</h5>
                <button type="button" className="btn-close" onClick={()=>setViewJob(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">{viewJob.location} • {viewJob.category}</p>
                <p>{viewJob.description}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setViewJob(null)}>Close</button>
                <button className="btn btn-primary" onClick={()=>{setApplyJob(viewJob); setViewJob(null);}}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {applyJob && (
        <ApplyForm job={applyJob} onClose={()=>setApplyJob(null)} onSuccess={loadApplied} />
      )}
    </DashboardLayout>
  )
}
