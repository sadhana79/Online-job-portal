const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next){
  const header = req.headers.authorization;
  let token = null;
  if(header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  if(!token && req.query && req.query.token) token = req.query.token;
  if(!token) return res.status(401).json({msg:'No token'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded;
    next();
  }catch(e){
    res.status(401).json({msg:'Invalid token'});
  }
}

function role(...roles){
  return (req,res,next)=>{
    if(!req.user || !roles.includes(req.user.role)){
      return res.status(403).json({msg:'Forbidden'});
    }
    next();
  }
}

module.exports = { auth, role };
