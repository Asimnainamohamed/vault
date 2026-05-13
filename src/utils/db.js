const DB='myvault-db'; const STORE='documents';
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function tx(mode){const db=await openDB(); return db.transaction(STORE,mode).objectStore(STORE);}
export async function addDocument(doc){const store=await tx('readwrite'); return new Promise((res,rej)=>{const r=store.add(doc);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
export async function getDocuments(){const store=await tx('readonly'); return new Promise((res,rej)=>{const r=store.getAll();r.onsuccess=()=>res(r.result.reverse());r.onerror=()=>rej(r.error);});}
export async function deleteDocument(id){const store=await tx('readwrite'); return new Promise((res,rej)=>{const r=store.delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
