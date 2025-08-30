import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import ProfileForm from '../components/ProfileForm'

export default function HRDashboard(){
  const [view, setView] = useState('add')
  const [jobs, setJobs] = useState([])
  const [title,setTitle]=useState('')
  const [category,setCategory]=useState('')
  const [description,setDescription]=useState('')
  const [location,setLocation]=useState('Remote')
  const [selectedJob,setSelectedJob]=useState(null)
  const [apps,setApps]=useState([])

  // Pagination & Search states
  const [jobPage, setJobPage] = useState(1)
  const [appPage, setAppPage] = useState(1)
  const [jobSearch, setJobSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')
  const pageSize = 5

  const loadMyJobs = async ()=>{
    try{
      const res = await api.get('/jobs/my')
      setJobs(res.data||[])
    }catch(e){}
  }

  const createJob = async (e)=>{
    e.preventDefault()
    try{
      await api.post('/jobs',{title,category,description,location})
      toast.success('Job added')
      setTitle(''); setCategory(''); setDescription(''); setLocation('Remote')
      loadMyJobs()
    }catch(e){ toast.error(e?.response?.data?.msg || 'Failed') }
  }

  const updateJob = async (job)=>{
    try{
      await api.put(`/jobs/${job.id}`, job)
      toast.success('Job updated')
      loadMyJobs()
    }catch(e){ toast.error('Update failed') }
  }

  const deleteJob = async (id)=>{
    if(!window.confirm('Delete this job?')) return
    try{
      await api.delete(`/jobs/${id}`)
      toast.success('Deleted')
      loadMyJobs()
      if(selectedJob && selectedJob.id===id){ setSelectedJob(null); setApps([]) }
    }catch(e){ toast.error('Delete failed') }
  }

  const openApplications = async (job)=>{
    setSelectedJob(job)
    setView('applications')
    try{
      const res = await api.get(`/applications/job/${job.id}`)
      setApps(res.data||[])
    }catch(e){}
  }

  const setStatus = async (appId, status)=>{
    try{
      await api.patch(`/applications/${appId}/status`, { status })
      toast.success('Status updated')
      if(selectedJob) openApplications(selectedJob)
    }catch(e){ toast.error('Failed to update') }
  }

  useEffect(()=>{ loadMyJobs() }, [])

  // Filtering & Pagination
  const filteredJobs = jobs.filter(j=> j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.category.toLowerCase().includes(jobSearch.toLowerCase()))
  const paginatedJobs = filteredJobs.slice((jobPage-1)*pageSize, jobPage*pageSize)

  const filteredApps = apps.filter(a=> (a.user_name||'').toLowerCase().includes(appSearch.toLowerCase()) || (a.user_email||'').toLowerCase().includes(appSearch.toLowerCase()))
  const paginatedApps = filteredApps.slice((appPage-1)*pageSize, appPage*pageSize)

  return (
    <div className="d-flex" style={{minHeight:'70vh'}}>
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2c3e50, #34495e)",
        borderRight: "1px solid #dce7f5"
      }}>
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-light min-vh-100">
          <h5 className="mb-3 text-white">HR Panel</h5>
          <div className="list-group w-100">
            <button className={'list-group-item list-group-item-action border rounded-2 mb-2 '+(view==='add'?'active-tab':'tab-btn')} onClick={()=>setView('add')}>Add Job</button>
            <button className={'list-group-item list-group-item-action border rounded-2 mb-2 '+(view==='manage'?'active-tab':'tab-btn')} onClick={()=>setView('manage')}>Manage Jobs</button>
            <button className={'list-group-item list-group-item-action border rounded-2 mb-2 '+(view==='applications'?'active-tab':'tab-btn')} onClick={()=>setView('applications')} disabled={!selectedJob}>View Applications</button>
            <button className={'list-group-item list-group-item-action mt-2 tab-btn'} onClick={()=>setView('profile')}>Profile</button>
          </div>
          <div className="mt-4 w-100">
            <h6 className="text-light">Your Jobs</h6>
            <div className="list-group small">
              {jobs.map(j => (
                <button key={j.id} className={'list-group-item list-group-item-action border rounded-2 mb-2 '+(selectedJob && selectedJob.id===j.id?'active-tab':'tab-btn')} onClick={()=>openApplications(j)}>
                  {j.title}
                </button>
              ))}
              {jobs.length===0 && <div className="text-muted small p-2">No jobs yet.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 p-3">
        {/* Add Job */}
        {view==='profile' && (<ProfileForm />)}

      {view==='add' && (
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Add Job</h5>
              <form onSubmit={createJob} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input className="form-control" value={category} onChange={e=>setCategory(e.target.value)} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="4" value={description} onChange={e=>setDescription(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control" value={location} onChange={e=>setLocation(e.target.value)} required />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary">Add Job</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Jobs */}
        {view==='manage' && (
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Manage Jobs</h5>
              <input className="form-control mb-3" placeholder="Search jobs..." value={jobSearch} onChange={e=>{setJobSearch(e.target.value); setJobPage(1)}} />
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr><th>Title</th><th>Category</th><th>Location</th><th>Applicants</th><th className="text-end">Actions</th></tr>
                  </thead>
                  <tbody>
                    {paginatedJobs.map(j=>(
                      <tr key={j.id}>
                        <td><input className="form-control" value={j.title||''} onChange={e=>setJobs(prev=>prev.map(x=>x.id===j.id?{...x,title:e.target.value}:x))} /></td>
                        <td><input className="form-control" value={j.category||''} onChange={e=>setJobs(prev=>prev.map(x=>x.id===j.id?{...x,category:e.target.value}:x))} /></td>
                        <td><input className="form-control" value={j.location||''} onChange={e=>setJobs(prev=>prev.map(x=>x.id===j.id?{...x,location:e.target.value}:x))} /></td>
                        <td>{j.applicants||0}</td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary" onClick={()=>updateJob(j)}>Save</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteJob(j.id)}>Delete</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={()=>openApplications(j)}>Applicants</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedJobs.length===0 && <tr><td colSpan="5" className="text-center text-muted">No jobs</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-primary" disabled={jobPage===1} onClick={()=>setJobPage(jobPage-1)}>Previous</button>
                <span>Page {jobPage} of {Math.ceil(filteredJobs.length/pageSize)||1}</span>
                <button className="btn btn-sm btn-outline-primary" disabled={jobPage>=Math.ceil(filteredJobs.length/pageSize)} onClick={()=>setJobPage(jobPage+1)}>Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Applications */}
        {view==='applications' && (
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title text-primary mb-0">Applicants {selectedJob? 'for '+selectedJob.title : ''}</h5>
                {selectedJob && <button className="btn btn-outline-secondary btn-sm" onClick={()=>openApplications(selectedJob)}>Refresh</button>}
              </div>
              <input className="form-control my-3" placeholder="Search applicants..." value={appSearch} onChange={e=>{setAppSearch(e.target.value); setAppPage(1)}} />
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr><th>Candidate</th><th>Email</th><th>Resume</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {paginatedApps.map(a=>(
                      <tr key={a.id}>
                        <td>{a.user_name || a.name || '—'}</td>
                        <td>{a.user_email || '—'}</td>
                        <td>{a.resume ? <a className="btn btn-sm btn-outline-primary" href={`http://localhost:5000/api/applications/${a.id}/resume?token=${localStorage.getItem('token')||''}`} target="_blank" rel="noreferrer">Download</a> : '—'}</td>
                        <td>
                          <span className={
                            a.status==='applied' ? 'badge bg-success' :
                            a.status==='scheduled' ? 'badge bg-warning text-dark' :
                            a.status==='rejected' ? 'badge bg-danger' :
                            a.status==='selected' ? 'badge bg-primary' : 'badge bg-secondary'
                          }>{a.status}</span>
                        </td>
                        <td className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-success" onClick={()=>setStatus(a.id,'selected')}>Select</button>
                          <button className="btn btn-sm btn-outline-warning" onClick={()=>setStatus(a.id,'scheduled')}>Schedule</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>setStatus(a.id,'rejected')}>Reject</button>
                        </td>
                      </tr>
                    ))}
                    {paginatedApps.length===0 && <tr><td colSpan="5" className="text-center text-muted">No applicants</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-primary" disabled={appPage===1} onClick={()=>setAppPage(appPage-1)}>Previous</button>
                <span>Page {appPage} of {Math.ceil(filteredApps.length/pageSize)||1}</span>
                <button className="btn btn-sm btn-outline-primary" disabled={appPage>=Math.ceil(filteredApps.length/pageSize)} onClick={()=>setAppPage(appPage+1)}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .tab-btn {
          background: transparent;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          color: white;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }
        .tab-btn:hover {
          background: #3d566e;
          color: #fff;
        }
        .active-tab {
          background: linear-gradient(135deg, #007bff, #3399ff);
          color: white !important;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}