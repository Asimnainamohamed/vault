import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search, Upload, FileText, Folder, Settings, Lock, Download, Trash2} from 'lucide-react';
import './style.css';
import {checkPin, isLoggedIn, logout} from './utils/auth';
import {addDocument, deleteDocument, getDocuments} from './utils/db';

function Login({onLogin}){
  const [pin,setPin]=useState('');
  const [err,setErr]=useState('');
  function submit(e){e.preventDefault(); if(checkPin(pin)){onLogin();} else setErr('Wrong PIN');}
  return <div className="screen center"><div className="card login-card"><Lock size={42}/><h1>MyVault</h1><p>Your private document vault</p><form onSubmit={submit}><input type="password" placeholder="Enter PIN" value={pin} onChange={e=>setPin(e.target.value)} maxLength="8"/><button>Unlock</button></form>{err&&<small className="error">{err}</small>}<small>Default PIN: 1234</small></div></div>
}

function Dashboard(){
  const [docs,setDocs]=useState([]); const [q,setQ]=useState(''); const [folder,setFolder]=useState('All');
  async function load(){setDocs(await getDocuments());}
  useEffect(()=>{load()},[]);
  async function onFile(e){
    const files=[...e.target.files];
    for(const file of files){
      const dataUrl=await new Promise(res=>{const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file)});
      await addDocument({name:file.name,type:file.type,size:file.size,folder:'Personal',dataUrl,createdAt:new Date().toISOString()});
    }
    e.target.value=''; load();
  }
  async function remove(id){await deleteDocument(id); load();}
  const folders=['All',...new Set(docs.map(d=>d.folder||'Personal'))];
  const filtered=docs.filter(d=>(folder==='All'||d.folder===folder)&&d.name.toLowerCase().includes(q.toLowerCase()));
  return <div className="app"><aside><h2>MyVault</h2><button className="nav active"><Folder size={18}/> Documents</button><button className="nav"><Settings size={18}/> Settings</button><button className="logout" onClick={()=>{logout(); location.reload()}}>Logout</button></aside><main><header><div><h1>Documents</h1><p>{docs.length} files saved offline</p></div><label className="upload"><Upload size={18}/> Upload<input type="file" multiple accept="image/*,.pdf" onChange={onFile}/></label></header><div className="search"><Search size={18}/><input placeholder="Search Aadhaar, PAN, resume..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="chips">{folders.map(f=><button key={f} onClick={()=>setFolder(f)} className={folder===f?'chip on':'chip'}>{f}</button>)}</div><section className="grid">{filtered.map(d=><div className="doc" key={d.id}><FileText size={34}/><h3>{d.name}</h3><p>{(d.size/1024).toFixed(1)} KB • {d.folder}</p><div className="actions"><a href={d.dataUrl} download={d.name}><Download size={17}/>Download</a><button onClick={()=>remove(d.id)}><Trash2 size={17}/>Delete</button></div></div>)}{filtered.length===0&&<div className="empty">No documents found. Upload your first file.</div>}</section></main></div>
}

function App(){const [auth,setAuth]=useState(isLoggedIn()); return auth?<Dashboard/>:<Login onLogin={()=>setAuth(true)}/>}
createRoot(document.getElementById('root')).render(<App/>);
