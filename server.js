import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchCompanies, searchJobs } from './sources.js';
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const dbPath = path.join(root, 'data', 'saved.json');
async function readDb() { try { return JSON.parse(await fs.readFile(dbPath, 'utf8')); } catch(e) { if(e.code==='ENOENT') return { saved:[] }; throw e; } }
function json(res, code, obj) { res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(obj)); }
async function body(req) { let s=''; for await(const c of req) { s+=c; if(s.length>500000) throw new Error('Payload too large'); } return JSON.parse(s||'{}'); }
http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url, `http://localhost:${port}`);
  if(url.pathname==='/api/companies' && req.method==='GET') return json(res,200,await searchCompanies(url.searchParams));
  if(url.pathname==='/api/jobs' && req.method==='GET') return json(res,200,await searchJobs(url.searchParams));
  if(url.pathname==='/api/saved' && req.method==='GET') return json(res,200,await readDb());
  if(url.pathname==='/api/saved' && req.method==='POST') {
   const item=await body(req);
   if(typeof item.id!=='string'||item.id.length>200||typeof item.name!=='string'||item.name.length>500) return json(res,400,{error:'Invalid record'});
   const db=await readDb(); const idx=db.saved.findIndex(x=>x.id===item.id);
   const entry={id:item.id,name:item.name,city:String(item.city||'').slice(0,200),url:String(item.url||'').slice(0,1000),kind:String(item.kind||'company'),status:String(item.status||'À contacter'),savedAt:new Date().toISOString()};
   if(idx>=0) db.saved[idx]={...db.saved[idx],...entry}; else db.saved.push(entry);
   await fs.mkdir(path.dirname(dbPath),{recursive:true}); await fs.writeFile(dbPath,JSON.stringify(db,null,2)); return json(res,200,db);
  }
  if(url.pathname==='/api/saved' && req.method==='DELETE') {
   const item=await body(req); const db=await readDb(); db.saved=db.saved.filter(x=>x.id!==item.id);
   await fs.mkdir(path.dirname(dbPath),{recursive:true}); await fs.writeFile(dbPath,JSON.stringify(db,null,2)); return json(res,200,db);
  }
  if(req.method!=='GET') return json(res,405,{error:'Method not allowed'});
  const allowed={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/style.css':'style.css'};
  const name=allowed[url.pathname]; if(!name) return json(res,404,{error:'Not found'});
  const content=await fs.readFile(path.join(root,'public',name));
  res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff'}); res.end(content);
 } catch(e) { console.error(e); json(res,500,{error:e.message||'Server error'}); }
}).listen(port,'127.0.0.1',()=>console.log(`Alternance Hunter: http://localhost:${port}`));
