const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('multer')();
const app = express();
require('dotenv').config();

const { pool } = require('./config/db');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req,res)=>res.send('Job Portal Backend Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on ' + PORT));
