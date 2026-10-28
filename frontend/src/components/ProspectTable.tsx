import {useMemo,useState} from 'react';
import {STATUSES} from '../types/company';
import type {Prospect,ProspectUpdate} from '../types/company';

type Props={items:Prospect[];onSave:(id:number,data:ProspectUpdate)=>Promise<void>;onDelete:(id:number)=>Promise<void>};
const fields=['status','contactName','contactEmail','nextFollowUp','notes'] as const;
function draft(p:Prospect):ProspectUpdate{return {status:p.status,contactName:p.contactName||'',contactEmail:p.contactEmail||'',nextFollowUp:p.nextFollowUp||null,notes:p.notes||''}}
export default function ProspectTable({items,onSave,onDelete}:Props){
 const [editing,setEditing]=useState(false);
 const [query,setQuery]=useState('');
 const [changed,setChanged]=useState<Record<number,ProspectUpdate>>({});
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const rows=useMemo(()=>items.filter(p=>(p.name+' '+p.city+' '+p.status+' '+(p.contactName||'')+' '+(p.notes||'')).toLowerCase().includes(query.toLowerCase())),[items,query]);
 function setField(p:Prospect,key:keyof ProspectUpdate,value:string|null){setChanged(old=>({...old,[p.id]:{...(old[p.id]||draft(p)),[key]:value}}))}
 async function saveOne(p:Prospect){setBusy(true);setMessage('');try{await onSave(p.id,changed[p.id]||draft(p));setChanged(old=>{const copy={...old};delete copy[p.id];return copy});setMessage('Modifications enregistrées')}catch(e){setMessage(String(e))}finally{setBusy(false)}}
 async function saveAll(){setBusy(true);setMessage('');let count=0;try{for(const [id,data] of Object.entries(changed)){await onSave(Number(id),data);count++}setChanged({});setMessage(count+' ligne(s) enregistrée(s)')}catch(e){setMessage('Erreur après '+count+' sauvegarde(s) : '+String(e))}finally{setBusy(false)}}
 async function remove(p:Prospect){if(!window.confirm('Retirer '+p.name+' du suivi ? Cette suppression est définitive.'))return;setBusy(true);try{await onDelete(p.id);setChanged(old=>{const copy={...old};delete copy[p.id];return copy})}catch(e){setMessage(String(e))}finally{setBusy(false)}}
 return <section><h2>Base prospects — vue tableau</h2>
 <p className="hint">Toutes les candidatures enregistrées dans PostgreSQL. Active le mode édition pour modifier les cellules.</p>
 <div className="actions">
  <input aria-label="Filtrer les prospects" placeholder="Filtrer les entreprises, villes, statuts…" value={query} onChange={e=>setQuery(e.target.value)}/>
  <button onClick={()=>setEditing(v=>!v)}>{editing?'Lecture seule':'Mode modification'}</button>
  {editing&&<button disabled={busy||!Object.keys(changed).length} onClick={()=>void saveAll()}>Enregistrer les modifications ({Object.keys(changed).length})</button>}
 </div>
 <p role="status">{message}</p>
 <div style={{overflowX:'auto',maxWidth:'100%'}}>
 <table style={{width:'100%',borderCollapse:'collapse',minWidth:1050}}>
 <thead><tr>{['Entreprise','Ville','NAF','Statut','Contact RH','Email','Relance','Notes','Actions'].map(h=><th key={h} style={{padding:8,textAlign:'left',borderBottom:'1px solid #52627a'}}>{h}</th>)}</tr></thead>
 <tbody>{rows.map(p=>{const f=changed[p.id]||draft(p);return <tr key={p.id}>
 <td style={{padding:8}}>{p.name}</td><td style={{padding:8}}>{p.city}</td><td style={{padding:8}}>{p.activity}</td>
 <td style={{padding:8}}>{editing?<select value={f.status} onChange={e=>setField(p,'status',e.target.value)}>{STATUSES.map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select>:p.status.replaceAll('_',' ')}</td>
 <td style={{padding:8}}>{editing?<input value={f.contactName||''} onChange={e=>setField(p,'contactName',e.target.value)}/>:p.contactName||'—'}</td>
 <td style={{padding:8}}>{editing?<input type="email" value={f.contactEmail||''} onChange={e=>setField(p,'contactEmail',e.target.value)}/>:p.contactEmail||'—'}</td>
 <td style={{padding:8}}>{editing?<input type="date" value={f.nextFollowUp||''} onChange={e=>setField(p,'nextFollowUp',e.target.value||null)}/>:p.nextFollowUp||'—'}</td>
 <td style={{padding:8}}>{editing?<textarea rows={2} value={f.notes||''} onChange={e=>setField(p,'notes',e.target.value)}/>:p.notes||'—'}</td>
 <td style={{padding:8}}><div className="actions">{editing&&<button disabled={busy||!changed[p.id]} onClick={()=>void saveOne(p)}>Sauver</button>}<button className="danger" disabled={busy} onClick={()=>void remove(p)}>Retirer</button></div></td>
 </tr>})}</tbody></table>
 </div><p>{rows.length} prospect(s) affiché(s) sur {items.length}</p>
 </section>;
}
