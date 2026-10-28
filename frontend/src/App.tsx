import{useEffect,useMemo,useState}from 'react';
import CompanyCard from './components/CompanyCard';
import SearchForm from './components/SearchForm';
import ProspectEditor from './components/ProspectEditor';
import AiWorkspace from './components/AiWorkspace';
import JobsWorkspace from './components/JobsWorkspace';
import{api}from './services/api';
import type{Company,Prospect,ProspectUpdate}from './types/company';
export default function App(){
 const[items,setItems]=useState<Company[]>([]),[saved,setSaved]=useState<Prospect[]>([]);
 const[page,setPage]=useState(1),[total,setTotal]=useState(0),[query,setQuery]=useState('informatique'),[dep,setDep]=useState('56');
 const[message,setMessage]=useState(''),[analysis,setAnalysis]=useState(''),[busy,setBusy]=useState(false);
 const[filter,setFilter]=useState('TOUS');
 const due=useMemo(()=>saved.filter(p=>p.nextFollowUp&&p.nextFollowUp<=new Date().toLocaleDateString('en-CA')&&p.status!=='REFUS'&&p.status!=='ACCEPTE').length,[saved]);
 const visible=useMemo(()=>saved.filter(p=>filter==='TOUS'||p.status===filter),[saved,filter]);
 useEffect(()=>{api.prospects().then(setSaved).catch(e=>setMessage(String(e)))},[]);
 async function refresh(){setSaved(await api.prospects())}
 async function search(p:number,q=query,d=dep){setBusy(true);setMessage('Recherche en cours…');try{const result=await api.companies(q,d,p);setItems(result.items);setTotal(result.total);setPage(p);setQuery(q);setDep(d);setMessage(result.items.length+' résultats affichés')}catch(e){setMessage(String(e))}finally{setBusy(false)}}
 async function save(x:Company){try{await api.save(x);await refresh();setMessage('Prospect sauvegardé')}catch(e){setMessage(String(e))}}
 async function update(id:number,data:ProspectUpdate){try{await api.update(id,data);await refresh();setMessage('Suivi mis à jour')}catch(e){setMessage(String(e))}}
 async function remove(id:number){try{await api.remove(id);await refresh();setMessage('Prospect supprimé')}catch(e){setMessage(String(e))}}
 async function analyze(x:Company){setAnalysis('Analyse Ollama en cours…');try{setAnalysis((await api.analyze(x)).analysis)}catch(e){setAnalysis(String(e))}}
 function exportCsv(){const rows=[['Entreprise','SIREN','Ville siege','NAF','Statut','Contact','Email','Relance','Notes','Source'],...saved.map(p=>[p.name,p.externalId,p.city,p.activity,p.status,p.contactName||'',p.contactEmail||'',p.nextFollowUp||'',p.notes||'',p.sourceUrl])];const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""').replace(/^[=+@-]/,"'$&")+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='alternance-prospects.csv';a.click();URL.revokeObjectURL(url)}
 return <div className="layout"><aside><h2>✦ Alternance Hunter</h2><p>BAC+5 EADL · LOCAL</p><nav><p>◉ Recherche</p><p>◉ Prospects</p><p>◉ Ollama</p><p>◉ France Travail</p></nav><small>React · TypeScript · Java 21</small></aside><main><header><span className="eyebrow">DASHBOARD / PROSPECTION</span><h1>Alternance Hunter AI</h1><p>Prospection intelligente avec Spring Boot, PostgreSQL et Ollama.</p></header><div className="stats"><div><strong>{items.length}</strong> Résultats</div><div><strong>{saved.length}</strong> Prospects</div><div><strong>{due}</strong> Relances à traiter</div><div><strong>{total}</strong> Total source</div></div><section><h2>Rechercher des entreprises</h2><SearchForm onSearch={(q,d)=>search(1,q,d)}/><p role="status">{message}</p></section><div className="columns"><section><h2>Entreprises</h2>{items.map(x=><CompanyCard key={x.externalId} company={x} onSave={save} onAnalyze={analyze}/>)}<div className="pager"><button disabled={page===1||busy} onClick={()=>search(page-1)}>Précédent</button><span>Page {page}</span><button disabled={busy||items.length<20} onClick={()=>search(page+1)}>Suivant</button></div><h2>Analyse rapide Ollama</h2><pre>{analysis||'Clique sur « Analyser IA » pour commencer.'}</pre></section><section><div className="heading-actions"><h2>Suivi des candidatures</h2><button onClick={exportCsv} disabled={!saved.length}>Exporter CSV</button></div><label>Filtrer les statuts<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="TOUS">Tous</option>{['A_CONTACTER','CONTACT_TROUVE','CANDIDATURE_PREPAREE','CANDIDATURE_ENVOYEE','RELANCE','ENTRETIEN','REFUS','ACCEPTE'].map(x=><option key={x} value={x}>{x.replaceAll('_',' ')}</option>)}</select></label>{visible.map(x=><ProspectEditor key={x.id} prospect={x} onSave={update} onDelete={remove}/>)}</section></div><div className="columns workspace"><JobsWorkspace/><AiWorkspace/></div><footer>Les contacts doivent être vérifiés. Aucun email envoyé automatiquement. L'export CSV contient des données personnelles : conserve-le localement.</footer></main></div>;
}
