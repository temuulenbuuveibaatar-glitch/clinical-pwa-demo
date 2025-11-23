/**
 * Import emergency guide files (markdown/JSON) from a local folder into CouchDB.
 * Usage: COUCH_URL=http://admin:admin@localhost:5984/guides node scripts/import_emergency_guides.js /path/to/exported/guides
 *
 * This script reads files recursively and bulk imports them as documents with type: 'guide'
 */
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const DIR = process.argv[2];
if(!DIR) {
  console.error('Usage: node scripts/import_emergency_guides.js /path/to/guides');
  process.exit(2);
}
const COUCH_URL = process.env.COUCH_URL || 'http://admin:admin@localhost:5984/guides';

async function ensureDb(){
  await fetch(COUCH_URL, { method: 'PUT' }).catch(()=>{});
}

function walk(dir){
  let results = [];
  fs.readdirSync(dir).forEach(f=>{
    const full = path.join(dir,f);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) results = results.concat(walk(full));
    else results.push(full);
  });
  return results;
}

(async ()=>{
  await ensureDb();
  const files = walk(DIR);
  const docs = files.map((file,i)=>{
    const content = fs.readFileSync(file,'utf8');
    return { _id: `guide:${i+1}`, type:'guide', filename:path.basename(file), path: file, content };
  });
  // chunked bulk upload
  const chunkSize = 500;
  for(let i=0;i<docs.length;i+=chunkSize){
    const chunk = docs.slice(i,i+chunkSize);
    const res = await fetch(COUCH_URL + '/_bulk_docs', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({docs:chunk})});
    console.log(await res.text());
  }
  console.log('Import complete. Imported', docs.length);
})();