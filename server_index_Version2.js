const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const {parse} = require('csv-parse/sync');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname,'..','seeds','users.json');
let users = [];
function loadUsers(){ try{ users = JSON.parse(fs.readFileSync(USERS_FILE)); }catch(e){ users = []; } }
loadUsers();

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-change-me';
const PORT = process.env.PORT || 3000;

// Basic login for demo (uses seeds/users.json)
app.post('/api/login', async (req,res)=>{
  const {email,password} = req.body;
  const u = users.find(x=>x.email===email);
  if(!u) return res.status(401).json({error:'invalid'});
  const ok = await bcrypt.compare(password,u.passwordHash);
  if(!ok) return res.status(401).json({error:'invalid'});
  const token = jwt.sign({sub:u.id,role:u.role,email:u.email}, JWT_SECRET, {expiresIn:'8h'});
  res.json({token});
});

app.get('/api/me', (req,res)=>{
  const auth = req.headers.authorization; if(!auth) return res.status(401).end();
  const token = auth.replace('Bearer ','');
  try{ const data = jwt.verify(token, JWT_SECRET); res.json(data);}catch(e){ res.status(401).end(); }
});

// Audit ingest endpoint (append-only recommended on server)
app.post('/api/audit', (req,res)=>{
  const evt = req.body;
  const auditsDir = path.join(__dirname,'..','data','audits');
  fs.mkdirSync(auditsDir,{recursive:true});
  const fname = path.join(auditsDir,`audit_${Date.now()}.json`);
  fs.writeFileSync(fname, JSON.stringify(evt));
  res.json({ok:true});
});

// Simple medication import endpoint (admin only for demo)
const upload = multer({dest: path.join(__dirname,'..','tmp')});
app.post('/api/import/medications', upload.single('file'), (req,res)=>{
  const file = req.file; if(!file) return res.status(400).json({error:'missing file'});
  const csv = fs.readFileSync(file.path);
  const records = parse(csv, {columns:true, skip_empty_lines:true});
  const outDir = path.join(__dirname,'..','data');
  fs.mkdirSync(outDir,{recursive:true});
  const out = path.join(outDir,'medications.json');
  fs.writeFileSync(out, JSON.stringify(records, null, 2));
  fs.unlinkSync(file.path);
  res.json({imported: records.length});
});

// Serve static exported content (emergency guides)
app.use('/content', express.static(path.join(__dirname,'..','data','content')));

// Mount users router if exists
try{
  const usersRouter = require('./users');
  app.use('/api/users', usersRouter);
}catch(e){
  console.warn('users router not mounted:', e.message);
}

// Health
app.get('/health', (req,res)=>res.json({ok:true,ts:Date.now()}));

app.listen(PORT, ()=>console.log('Server listening on', PORT));