const path = require('path');
const { findById, updateProfile, listUsers } = require('../models/User');

exports.me = (req,res)=>{
  findById(req.user.id)
    .then(([[user]])=>{
      if(!user) return res.status(404).json({msg:'Not found'});
      if(!user.avatar) user.avatar = 'assets/default-avatar.png';
      res.json(user);
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.updateProfile = (req,res)=>{
  const { name, email, contact, education, college, experience, skills } = req.body;
  const avatar = req.file ? '/uploads/avatars/' + req.file.filename : undefined;
  const fields = { name, email, contact, education, college, experience, skills };
  if(avatar!==undefined) fields.avatar = avatar;
  updateProfile(req.user.id, fields)
    .then(()=> res.json({ok:true}))
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.list = (req,res)=>{
  listUsers()
    .then(([rows])=>{
      rows = rows.map(r=> ({...r, avatar: r.avatar || 'assets/default-avatar.png'}));
      res.json(rows);
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};
