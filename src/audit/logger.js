import {db} from '../db/pouch.js';

export async function logEvent(event){
  const doc = {
    _id: `audit:${Date.now()}:${Math.random().toString(36).slice(2,8)}`,
    type:'audit',
    ts:new Date().toISOString(),
    ...event
  };
  try{
    await db.put(doc);
  }catch(e){
    console.error('audit log failed', e);
  }
}