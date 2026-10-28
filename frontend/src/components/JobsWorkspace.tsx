import{useEffect,useState}from 'react';
import{api}from '../services/api';
import type{JobOffer}from '../types/job';
export default function JobsWorkspace(){
 const[items,setItems]=useState<JobOffer[]>([]),[keywords,setKeywords]=useState('développeur alternance'),[department,setDepartment]=useState('56'),[configured,setConfigured]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const load=()=>api.jobs().then(setItems).catch(e=>setMessage(String(e)));
 useEffect(()=>{load();api.jobsStatus().then(x=>setConfigured(x.configured)).catch(()=>{})},[]);
 async function refresh(){setBusy(true);setMessage('Recherche en cours…');try{const x=await api.refreshJobs(keywords,department);setMessage(x.message+' · '+x.count+' offres reçues');await load()}catch(e){setMessage(String(e))}finally{setBusy(false)}}
 return <section><h2>Offres France Travail</h2><p className="hint">{configured?'API configurée':'API non configurée : ajouter FRANCE_TRAVAIL_CLIENT_ID et SECRET dans .env.'}</p><div className="filters"><input aria-label="Mots clés offres" value={keywords} onChange={e=>setKeywords(e.target.value)}/><select aria-label="Département offres" value={department} onChange={e=>setDepartment(e.target.value)}>{['56','35','44','29','22'].map(x=><option key={x}>{x}</option>)}</select><button disabled={busy||!configured} onClick={refresh}>Actualiser les offres</button></div><p role="status">{message}</p>{items.map(x=><article className="company" key={x.id}><h3>{x.title}</h3><p>{x.company||'Employeur non indiqué'} · {x.location}</p><p>{x.description?.slice(0,300)}…</p><a href={x.url} target="_blank" rel="noreferrer">Consulter l'offre ↗</a></article>)}</section>;
}
