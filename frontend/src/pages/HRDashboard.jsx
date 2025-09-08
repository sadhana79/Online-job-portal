import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import HRProfileForm from '../components/HRProfileForm'
import '../App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUsers } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";


export default function HRDashboard() {
  const [view, setView] = useState('statistics')
  const [jobs, setJobs] = useState([])
  const [apps, setApps] = useState([])

  const [title,setTitle] = useState('')
  const [company_name,setCompany] = useState('')
  const [category,setCategory] = useState('')
  const [description,setDescription] = useState('')
  const [location,setLocation] = useState('Remote')
    const defaultAvatar = '/reglogo.png'; 

  
  const categories = [
    "Information Technology (IT) & Software",
    "Engineering",
    "Healthcare & Medical",
    "Education & Training",
    "Finance & Accounting",
    "Sales & Marketing",
    "Human Resources",
    "Design & Creative",
    "Customer Support & BPO",
    "Remote & Freelance"
  ]

  const [selectedCategory, setSelectedCategory] = useState('')

  
  const pageSize = 5
  const [jobPage, setJobPage] = useState(1)
  const [jobSearch, setJobSearch] = useState('')
  const [appPage, setAppPage] = useState(1)
  const [appSearch, setAppSearch] = useState('')

  
  const [scheduleModal, setScheduleModal] = useState(false)
  const [schedAppId, setSchedAppId] = useState(null)
  const [scheduleTime, setScheduleTime] = useState('')
  const [mode, setMode] = useState('online')
  const [meetLink, setMeetLink] = useState('')
  const [address, setAddress] = useState('')
  const [me, setMe] = useState({})


  const openScheduleForm = (appId) => {
    setSchedAppId(appId)
    setScheduleTime('')
    setMode('online')
    setMeetLink('')
    setAddress('')
    setScheduleModal(true)
  }

  const submitSchedule = async (e) => {
    e.preventDefault()
    try{
      await api.post(`/applications/${schedAppId}/schedule`, {
        mode,
        meet_link: mode === 'online' ? meetLink : null,
        address: mode === 'offline' ? address : null,
        schedule_time: scheduleTime
      })
      toast.success('Interview scheduled and user emailed')
      setApps(prev => prev.map(a => a.id === schedAppId ? { ...a, status: 'scheduled' } : a))
      setScheduleModal(false)
    }catch(e){ toast.error('Failed to schedule') }
  }


  const loadMyJobs = async () => {
    try{
      const res = await api.get('/jobs/my')
      setJobs(res.data || [])
    }catch(e){}
  }

  
  const createJob = async (e) => {
    e.preventDefault()
    try{
      await api.post('/jobs', {title, company_name,category, description, location})
      toast.success('Job added')
      setTitle(''); setCategory(''); setCompany('');setDescription(''); setLocation('Remote')
      loadMyJobs()
    }catch(e){ toast.error(e?.response?.data?.msg || 'Failed') }
  }


  const updateJob = async (job) => {
    try{
      await api.put(`/jobs/${job.id}`, job)
      toast.success('Job updated')
      loadMyJobs()
    }catch(e){ toast.error('Update failed') }
  }

  const deleteJob = async (id) => {
    if(!window.confirm('Delete this job?')) return
    try{
      await api.delete(`/jobs/${id}`)
      toast.success('Deleted')
      loadMyJobs()
    }catch(e){ toast.error('Delete failed') }
  }

 
  const loadApplications = async () => {
    if(!selectedCategory) {
      setApps([])
      return
    }
    try{
      const res = await 
    api.get(`/applications?category=${encodeURIComponent(selectedCategory)}`)

      setApps(res.data || [])
    }catch(e){
      toast.error('Failed to fetch applications')
    }
  }


  const setStatus = async (appId, status) => {
    try{
      await api.patch(`/applications/${appId}/status`, { status })
      toast.success('Status updated')
      loadApplications()
    }catch(e){ toast.error('Failed to update') }
  }


  useEffect(()=>{ loadMyJobs() }, [])
  useEffect(()=>{ if(view==='applications') loadApplications() }, [view, selectedCategory])
    useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await api.get('/users/me')
      setMe(res.data || {})
    } catch (err) {
      console.error(err)
    }
  }
  fetchMe()
}, [])


  
  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.category.toLowerCase().includes(jobSearch.toLowerCase()))
  const paginatedJobs = filteredJobs.slice((jobPage-1)*pageSize, jobPage*pageSize)

  const filteredApps = apps
    .filter(a => (a.user_name||'').toLowerCase().includes(appSearch.toLowerCase()) || (a.user_email||'').toLowerCase().includes(appSearch.toLowerCase()))
  const paginatedApps = filteredApps.slice((appPage-1)*pageSize, appPage*pageSize)

  return (
    <div className="d-flex" style={{minHeight:'70vh'}}>
  
  <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{
    minHeight: "100vh",
    background: "linear-gradient(180deg, #2c3e50, #34495e)",
    borderRight: "1px solid #dce7f5"
  }}>
    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-light min-vh-100">
      
      
      <div className="d-flex flex-column align-items-center w-100 mb-4">
        <img
                  src={
                    me.avatar
                      ? `http://localhost:5000${me.avatar}`
                      : defaultAvatar
                  }
                  alt="profile"
                  className="rounded-circle mb-2"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = defaultAvatar)} 
                />
        <div className="fw-bold fs-6 text-center">{me?.name || "Your Name"}</div>
      </div>

    
      <div className="list-group w-100">
         <button className={`list-group-item list-group-item-action mb-2 ${view==='statistics'?'active-tab':'tab-btn'}`} onClick={()=>setView('statistics')}>Statistics</button>
        <button className={`list-group-item list-group-item-action mb-2 ${view==='add'?'active-tab':'tab-btn'}`} onClick={()=>setView('add')}>Add Job</button>
        <button className={`list-group-item list-group-item-action mb-2 ${view==='manage'?'active-tab':'tab-btn'}`} onClick={()=>setView('manage')}>Manage Jobs</button>
        <button className={`list-group-item list-group-item-action mb-2 ${view==='applications'?'active-tab':'tab-btn'}`} onClick={()=>setView('applications')}>View Applications</button>
        <button className={`list-group-item list-group-item-action mt-2 tab-btn`} onClick={()=>setView('profile')}>Profile</button>
      </div>
    </div>
  </div>


    
      <div className="flex-grow-1 p-3">

        {view==='profile' && <HRProfileForm />}
        {view==='add' && (
      <div 
  className="card border-primary shadow-sm text-black"   style={{
   background: "linear-gradient(135deg, #d5dadeff, #b9d0efff)"}}
>
            <div className="card-body">
              <h4 className="card-title text-primary">Add Job</h4>
              <form onSubmit={createJob} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
                </div>
                  <div className="col-md-6">
                  <label className="form-label">Company Name</label>
                  <input className="form-control" value={company_name} onChange={e=>setCompany(e.target.value)} required />
                
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={category} onChange={e=>setCategory(e.target.value)} required>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
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
              <button className="btn btn-primary me-2">Add Job</button>      
             <button className="btn btn-secondary" onClick={()=>setView("statistics")}>Cancel</button>
             </div>

              </form>
            </div>
          </div>
        )}

        
       {view==='manage' && (
  <div className="card  shadow-sm">
  <div className="card-body">
      <h4 className="card-title text-primary" style={{textAlign: 'center',    
    color: '#101e71ff', fontWeight: 'bold'}}>Manage Jobs</h4>

      
      <input 
        className="form-control mb-3" 
        placeholder="Search jobs..." 
        value={jobSearch} 
        onChange={e=>{setJobSearch(e.target.value); setJobPage(1)}}  
        style={{ border: '2px solid #8f8f8fff', borderRadius: '6px' }} 
      />

  
      <div className="table-responsive">
        <table className="table table-striped align-middle custom-table-header">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Company</th>
              <th>Category</th>
              <th>Location</th>
              
              <th className="text-end">Actions</th>
            </tr>
          </thead>
              <tbody>
  {paginatedJobs.map((j, index) => (
    <tr key={j.id}>
      
      <td>{(jobPage - 1) * pageSize + index + 1}</td>

      <td>
        <input 
          className="form-control" 
          value={j.title || ''} 
          onChange={e => setJobs(prev => prev.map(x => x.id === j.id ? {...x, title: e.target.value} : x))} 
        />
      </td>
      <td>
        <input 
          className="form-control" 
          value={j.company_name || ''} 
          onChange={e => setJobs(prev => prev.map(x => x.id === j.id ? {...x, company_name: e.target.value} : x))} 
        />
      </td>
      <td>
        <input 
          className="form-control" 
          value={j.category || ''} 
          onChange={e => setJobs(prev => prev.map(x => x.id === j.id ? {...x, category: e.target.value} : x))} 
        />
      </td>
      <td>
        <input 
          className="form-control" 
          value={j.location || ''} 
          onChange={e => setJobs(prev => prev.map(x => x.id === j.id ? {...x, location: e.target.value} : x))} 
        />
      </td>
      
      <td className="text-end">
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-success" onClick={() => updateJob(j)}>Save</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteJob(j.id)}>Delete</button>
        </div>
      </td>
    </tr>
  ))}

  {paginatedJobs.length === 0 && (
    <tr>
      <td colSpan="6" className="text-center text-muted">No jobs</td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button 
          className="btn btn-outline-primary btn-sm" 
          disabled={jobPage===1} 
          onClick={()=>setJobPage(prev=>prev-1)}
        >
          Previous
        </button>
        <span>Page {jobPage} of {Math.ceil(filteredJobs.length/pageSize) || 1}</span>
        <button 
          className="btn btn-outline-primary btn-sm" 
          disabled={jobPage===Math.ceil(filteredJobs.length/pageSize) || jobPage===0} 
          onClick={()=>setJobPage(prev=>prev+1)}
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}


        
        {view==='applications' && (
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-primary mb-3"style={{ textAlign: 'center',    
    color: '#101e71ff',fontWeight: 'bold'}} >Applicants</h4>

            
              <div className="row mb-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Search applicants..." value={appSearch} onChange={e=>{setAppSearch(e.target.value); setAppPage(1)}}  style={{ border: '2px solid #848080ff', borderRadius: '6px' }}/>
                </div>
                <div className="col-md-6">
                  <select className="form-control" value={selectedCategory} onChange={e=>{setSelectedCategory(e.target.value); setAppPage(1)}}  style={{ border: '2px solid #8d8888ff', borderRadius: '6px' }}>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                   <table className="table table-striped align-middle custom-table-header">
                  <thead>
                    <tr><th>Sr No</th><th>Candidate</th><th>Email</th><th>Job Title</th><th>Resume</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
  {paginatedApps.map((a, index) => (
    <tr key={a.id}>

      <td>{(appPage - 1) * pageSize + index + 1}</td>

      <td>{a.user_name || '—'}</td>
      <td>{a.user_email || '—'}</td>
         <td>{a.job_title || '—'}</td>
      
      <td>
        {a.resume ? (
          <a
            className="btn btn-sm btn-outline-primary"
            href={`http://localhost:5000/api/applications/${a.id}/resume?token=${localStorage.getItem('token') || ''}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        ) : '—'}
      </td>
      <td>
        <span className={
          a.status === 'applied' ? 'badge bg-success' :
          a.status === 'scheduled' ? 'badge bg-warning text-dark' :
          a.status === 'rejected' ? 'badge bg-danger' :
          a.status === 'selected' ? 'badge bg-primary' : 'badge bg-secondary'
        }>
          {a.status}
        </span>
      </td>
      <td className="d-flex gap-2">
        <button className="btn btn-sm btn-outline-success" onClick={() => setStatus(a.id,'selected')}>Select</button>
        <button className="btn btn-sm btn-outline-warning" onClick={() => openScheduleForm(a.id)}>Schedule</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => setStatus(a.id,'rejected')}>Reject</button>
      </td>
    </tr>
  ))}
  {paginatedApps.length === 0 && (
    <tr>
      <td colSpan="6" className="text-center text-muted">No applicants</td>
    </tr>
  )}
</tbody>

                </table>
              </div>
          
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button 
          className="btn btn-outline-primary btn-sm" 
          disabled={appPage===1} 
          onClick={()=>setAppPage(prev=>prev-1)}
        >
          Previous
        </button>
        <span>Page {appPage} of {Math.ceil(filteredApps.length/pageSize) || 1}</span>
        <button 
          className="btn btn-outline-primary btn-sm" 
          disabled={appPage===Math.ceil(filteredApps.length/pageSize) || appPage===0} 
          onClick={()=>setAppPage(prev=>prev+1)}
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}
</div>
          


      
      {scheduleModal && (
        <div className="modal-backdrop" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="card p-3" style={{width:520}}>
            <h4>Schedule Interview</h4>
            <form onSubmit={submitSchedule}>
              <div className="mb-2">
                <label className="form-label">Mode of Interview</label>
                <select className="form-control" value={mode} onChange={e=>setMode(e.target.value)} required>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {mode === 'online' && (
                <div className="mb-2">
                  <label className="form-label">Google Meet Link</label>
                  <input className="form-control" value={meetLink} onChange={e=>setMeetLink(e.target.value)} required={mode==='online'} />
                </div>
              )}

              {mode === 'offline' && (
                <div className="mb-2">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" value={address} onChange={e=>setAddress(e.target.value)} required={mode==='offline'} />
                </div>
              )}

              <div className="mb-2">
                <label className="form-label">Schedule Time</label>
                <input type="datetime-local" className="form-control" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} required />
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-secondary me-2" onClick={()=>setScheduleModal(false)}>Cancel</button>
                <button className="btn btn-primary">Send & Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    {view === 'statistics' && (
  <div className="container py-4">
    <h2 className="mb-4 text-center">HR Dashboard</h2>

    
    <div className="row mb-5">
      <div className="col-md-6">
       <div
  className="card shadow-sm border-0 text-center p-3 text-white"
  style={{
    background: "linear-gradient(135deg, #1a354cff, #46929eff)",
    width: "500px",
    height: "200px",
    borderRadius: "15px"
  }}
>
  <FontAwesomeIcon icon={faBriefcase} size="4x" className="mb-2" />
  <h2>Total Jobs</h2>
  <h2>{jobs.length}</h2>
</div>
 </div>
      <div className="col-md-6">
           <div
  className="card shadow-sm border-0 text-center p-3 text-white"
  style={{
    background: "linear-gradient(135deg, #3e0e54ff, #851d89ff)",
    width: "500px",
    height: "200px",
    borderRadius: "15px"
  }}
>
          <FontAwesomeIcon icon={faUsers} size="4x" className="mb-2" />
          <h2>Total Applications</h2>
          <h2>{apps.length}</h2>
        </div>
      </div>
    </div>

    <div className="d-flex justify-content-center">
      <div className="card shadow-sm border-1 p-4" style={{ width: "400px", height: "400px", backgroundColor:"#fbfbffff" }}>
        <h5 className="text-center mb-3">Jobs vs Applications</h5>
        <PieChart width={350} height={300}>
          <Pie
            dataKey="value"
            data={[
              { name: 'Jobs', value: jobs.length },
              { name: 'Applications', value: apps.length }
            ]}
            cx="50%" cy="50%" outerRadius={130} fill="#8884d8" label
          >
            <Cell fill="#2d6778ff" />
            <Cell fill="#94bdc4ff" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  </div>
)}


      <style>
        {`
          .tab-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 10px 15px;
            border-radius: 8px;
            color: white;
            transition: all 0.3s ease;
          }
          .tab-btn:hover {
            background: #34495e;
            color: #f1f1f1;
          }
          .active-tab {
            background: linear-gradient(135deg, #007bff, #3399ff);
            color: white !important;
            border: 1px solid #3399ff;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .sidebar-item-btn {
            display: block;
            width: 100%;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
}
 
