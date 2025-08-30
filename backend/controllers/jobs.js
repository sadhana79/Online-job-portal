
const { pool } = require('../config/db');

exports.create = async (req,res)=>{
  try{
    const { title, category, description, location } = req.body;
    await pool.query('INSERT INTO jobs (title,category,description,location,created_by) VALUES (?,?,?,?,?)',[title,category,description,location, req.user.id]);
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
};

exports.list = async (req,res)=>{
  try{
    const { q, category } = req.query;
    let sql = 'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) as applicants FROM jobs j WHERE 1=1';
    const params = [];
    if(q){ sql += ' AND (j.title LIKE ? OR j.description LIKE ?)'; params.push('%'+q+'%','%'+q+'%'); }
    if(category){ sql += ' AND j.category=?'; params.push(category); }
    sql += ' ORDER BY j.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
};

exports.mine = async (req,res)=>{
  try{
    const [rows] = await pool.query('SELECT * FROM jobs WHERE created_by=? ORDER BY created_at DESC',[req.user.id]);
    res.json(rows);
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
};

exports.byId = async (req,res)=>{
  const [rows] = await pool.query('SELECT * FROM jobs WHERE id=?',[req.params.id]);
  if(!rows.length) return res.status(404).json({msg:'Not found'});
  res.json(rows[0]);
};

exports.update = async (req,res)=>{
  const { title, category, description, location } = req.body;
  await pool.query('UPDATE jobs SET title=?, category=?, description=?, location=? WHERE id=?',[title,category,description,location, req.params.id]);
  res.json({ok:true});
};

exports.remove = async (req,res)=>{
  await pool.query('DELETE FROM jobs WHERE id=?',[req.params.id]);
  res.json({ok:true});
};
