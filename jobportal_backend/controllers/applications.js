
const path = require('path');
const fs = require('fs');
const App = require('../models/Application');

exports.apply = (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  if (isNaN(jobId)) return res.status(400).json({ msg: 'Invalid job id' });

  const { name, education, college, experience, skills, current_ctc } = req.body;
  let resumePath = null;
  if (req.file) {
    const rel = path.join('uploads', 'resumes', path.basename(req.file.path)).replace(/\\/g, '/');
    resumePath = rel;
  }
  const payload = { job_id: jobId, user_id: req.user.id, name, education, college, experience, skills, current_ctc, resume: resumePath };
  App.create(payload)
    .then(() => res.json({ ok: true, resume: resumePath }))
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.forJob = (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  if (isNaN(jobId)) return res.status(400).json({ msg: 'Invalid job id' });
  App.forJob(jobId)
    .then(([rows]) => res.json(rows))
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.mine = (req, res) => {
  App.mine(req.user.id)
    .then(([rows]) => res.json(rows))
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.updateStatus = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!['pending', 'shortlisted', 'rejected', 'hired'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  App.updateStatus(id, status)
    .then(() => res.json({ ok: true }))
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.updateStatus = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const allowed = ['pending','shortlisted','rejected','hired','selected','scheduled'];
  if (!allowed.includes(status)) return res.status(400).json({ msg: 'Invalid status' });

  let normalized = status;
  if (status === 'selected') normalized = 'shortlisted';
  if (status === 'scheduled') normalized = 'scheduled';

  App.updateStatus(id, normalized)
    .then(() => res.json({ ok: true, status: normalized }))
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.forCategory = (req, res) => {
  const category = (req.query.category || 'all').trim();
  App.forCategory(category)
    .then(([rows]) => {
      // Normalize fields expected by frontend
      const mapped = rows.map(a => ({
        id: a.id,
        user_id: a.user_id,
        user_name: a.user_name || a.name,
        user_email: a.user_email,
        contact: a.contact || null,
        job_title: a.job_title || null,
        job_category: a.job_category || null,
        status: a.status,
        resume: a.resume,
        created_at: a.created_at
      }));
      res.json(mapped);
    })
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};

exports.downloadResume = (req, res) => {
  const id = parseInt(req.params.id, 10);
  App.getResumePath(id)
    .then(([rows]) => {
      if (!rows.length || !rows[0].resume) return res.status(404).json({ msg: 'No resume found' });
      const p = path.join(__dirname, '..', rows[0].resume);
      if (!fs.existsSync(p)) return res.status(404).json({ msg: 'File missing on server' });
      res.download(p);
    })
    .catch(e => { console.error(e); res.status(500).json({ msg: 'Server error' }); });
};
