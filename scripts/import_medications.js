// Node script to import a CSV into CouchDB via HTTP (requires CouchDB running and admin creds)
const fs = require('fs');
const fetch = require('node-fetch');
const csv = fs.readFileSync(process.argv[2],'utf8');
const {parse} = require('csv-parse/sync');
const records = parse(csv, {columns:true, skip_empty_lines:true});
(async ()=>{
  const url = process.env.COUCH_URL || 'http://admin:admin@localhost:5984/medications';
  // ensure DB exists
  await fetch(url,{method:'PUT'});
  // bulk docs
  const bulk = {docs: records.map((r,i)=>Object.assign({_id: `med:${i+1}`}, r))};
  const res = await fetch(url + '/_bulk_docs', {method:'POST', body:JSON.stringify(bulk), headers:{'Content-Type':'application/json'}});
  console.log(await res.text());
})();