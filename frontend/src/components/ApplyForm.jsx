
import { useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function ApplyForm({ job, onClose, onSuccess }){
  const [name,setName] = useState('')
  const [education,setEducation] = useState('')
  const [college,setCollege] = useState('')
  const [experience,setExperience] = useState('')
  const [skills,setSkills] = useState('')
  const [currentCtc,setCurrentCtc] = useState('')
  const [resume,setResume] = useState(null)
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    api.get('/users/me').then(r=>{
      const u = r.data||{};
      if(u.name) setName(u.name);
      if(u.education) setEducation(u.education);
      if(u.college) setCollege(u.college);
      if(u.experience) setExperience(u.experience);
      if(u.skills) setSkills(u.skills);
    }).catch(()=>{});
  },[]);

  const submit = async (e)=>{
    e.preventDefault()
    if(!resume){ toast.error('Please upload your resume'); return }
    try{
      setLoading(true)
      const fd = new FormData()
      fd.append('name', name)
      fd.append('education', education)
      fd.append('college', college)
      fd.append('experience', experience)
      fd.append('skills', skills)
      fd.append('current_ctc', currentCtc)
      fd.append('resume', resume)
      await api.post(`/applications/${job.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Applied successfully')
      onSuccess && onSuccess()
      onClose && onClose()
    }catch(err){
      console.error(err)
      toast.error(err?.response?.data?.msg || 'Failed to apply')
    }finally{
      setLoading(false)
    }
  }

  if(!job) return null
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Apply for {job.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={submit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Education</label>
                  <input className="form-control" value={education} onChange={e=>setEducation(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">College</label>
                  <input className="form-control" value={college} onChange={e=>setCollege(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Experience</label>
                  <input className="form-control" value={experience} onChange={e=>setExperience(e.target.value)} placeholder="e.g. 2 years" />
                </div>
                <div className="col-12">
                  <label className="form-label">Skills</label>
                  <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="e.g. React, Node, SQL" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Current CTC</label>
                  <input className="form-control" value={currentCtc} onChange={e=>setCurrentCtc(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Resume (PDF/DOC/DOCX)</label>
                  <input type="file" className="form-control" onChange={e=>setResume(e.target.files[0])} accept=".pdf,.doc,.docx" required />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Applying...':'Apply'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
