const enc = new TextEncoder();
const dec = new TextDecoder();

export async function importKey(rawKey){
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, ['encrypt','decrypt']);
}

export async function genKey(){
  return crypto.subtle.generateKey({name:'AES-GCM', length:256}, true, ['encrypt','decrypt']);
}

export async function encryptText(key, plain){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plain));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(ct)));
  return {iv:Array.from(iv), ct:b64};
}

export async function decryptText(key, ivArray, b64){
  const iv = new Uint8Array(ivArray);
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, bytes);
  return dec.decode(plain);
}