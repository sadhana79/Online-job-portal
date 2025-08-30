const path = require('path');
const fs = require('fs');
const App = require('../models/Application');

exports.apply = (req,res)=>{
  const jobId = parseInt(req.params.jobId,10);
  if(isNaN(jobId)) return res.status(400).json({msg:'Invalid job id'});
  const { name, education, college, experience, skills, current_ctc } = req.body;
  let resumePath = null;
  if (req.file) {
    const rel = path.join('uploads','resumes', path.basename(req.file.path)).replace(/\\/g,'/');
    resumePath = rel;
  }
  const payload = { job_id: jobId, user_id: req.user.id, name, education, college, experience, skills, current_ctc, resume: resumePath };
  App.create(payload)
    .then(()=> res.json({ok:true, resume: resumePath}))
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.mine = (req,res)=>{
  App.mine(req.user.id)
    .then(([rows])=> res.json(rows))
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.forJob = (req,res)=>{
  const jobId = parseInt(req.params.jobId,10);
  if(isNaN(jobId)) return res.status(400).json({msg:'Invalid job id'});
  App.forJob(jobId)
    .then(([rows])=> res.json(rows))
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.updateStatus = (req,res)=>{
  const id = parseInt(req.params.id,10);
  const { status } = req.body;
  App.updateStatus(id, status)
    .then(()=> res.json({ok:true}))
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.downloadResume = (req,res)=>{
  const id = parseInt(req.params.id,10);
  App.getResumePath(id)
    .then(([rows])=>{
      if(!rows.length || !rows[0].resume) return res.status(404).json({msg:'No resume found'});
      const p = path.join(__dirname, '..', rows[0].resume);
      if(!fs.existsSync(p)) return res.status(404).json({msg:'File missing on server'});
      res.download(p);
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};
