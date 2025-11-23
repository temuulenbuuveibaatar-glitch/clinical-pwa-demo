import PouchDB from 'pouchdb-browser';
import find from 'pouchdb-find';
PouchDB.plugin(find);

export const db = new PouchDB('clinical_local_v1');

export async function initDB(){
  await db.createIndex({index:{fields:['type']}});

  try{
    const res = await db.find({selector:{type:'patient'}});
    if((res.docs||[]).length===0){
      await db.put({_id:'patient:sample-1', type:'patient', name:'John Doe', dob:'1975-01-01'});
    }
  }catch(e){ console.warn('initDB:', e); }
}

export async function syncToServer(){
  const serverUrl = (import.meta.env.VITE_SYNC_URL || '').trim();
  if(!serverUrl) throw new Error('VITE_SYNC_URL not set');
  const remote = new PouchDB(serverUrl, {skip_setup:true});
  await db.replicate.to(remote);
  await db.replicate.from(remote);
}