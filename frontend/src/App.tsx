import{useEffect,useState}from 'react';
import CompanyCard from './components/CompanyCard';
import SearchForm from './components/SearchForm';
import{api}from './services/api';
import type{Company,Prospect}from './types/company';
export default function App(){
 const[items,setItems]=useState<Company[]>([]),[saved,setSaved]=useState<Prospect[]>([]);
 const[page,setPage]=useState(1),[total,setTotal]=useState(0),[query,setQuery]=useState('informatique'),[dep,setDep]=useState('56');
 const[message,setMessage]=useState(''),[analysis,setAnalysis]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{api.prospects().then(setSaved).catch(e=>setMessage(String(e)))},[]);
 async function search(p:number,q=query,d=dep){setBusy(true);setMessage('Recherche en cours…');try{const result=await api.companies(q,d,p);setItems(result.items);setTotal(result.total);setPage(p);setQuery(q);setDep(d);setMessage(result.items.length+' résultats affichés')}catch(e){setMessage(String(e))}finally{setBusy(false)}}
 async function save(x:Company){try{await api.save(x);setSaved(await api.prospects());setMessage('Prospect sauvegardé')}catch(e){setMessage(String(e))}}
 async function analyze(x:Company){setAnalysis('Analyse Ollama en cours…');try{setAnalysis((await api.analyze(x)).analysis)}catch(e){setAnalysis(String(e))}}
 return <div className="layout"><aside><h2>✦ Alternance Hunter</h2><p>BAC+5 EADL · LOCAL</p><nav><p>◉ Recherche</p><p>◉ Prospects</p><p>◉ Ollama</p></nav><small>React · TypeScript · Java 21</small></aside><main><header><span className="eyebrow">DASHBOARD / PROSPECTION</span><h1>Alternance Hunter AI</h1><p>Prospection intelligente avec Spring Boot, PostgreSQL et Ollama.</p></header><div className="stats"><div><strong>{items.length}</strong> Résultats</div><div><strong>{saved.length}</strong> Prospects</div><div><strong>{total}</strong> Total source</div></div><section><h2>Rechercher des entreprises</h2><SearchForm onSearch={(q,d)=>search(1,q,d)}/><p role="status">{message}</p></section><div className="columns"><section><h2>Entreprises</h2>{items.map(x=><CompanyCard key={x.externalId} company={x} onSave={save} onAnalyze={analyze}/>)}<div className="pager"><button disabled={page===1||busy} onClick={()=>search(page-1)}>Précédent</button><span>Page {page}</span><button disabled={busy||items.length<20} onClick={()=>search(page+1)}>Suivant</button></div></section><section><h2>Prospects PostgreSQL</h2>{saved.map(x=><article className="company" key={x.id}><b>{x.name}</b><p>{x.city} · {x.status}</p><a href={'https://www.linkedin.com/search/results/people/?keywords='+encodeURIComponent(x.name+' recrutement')} target="_blank" rel="noreferrer">Rechercher RH ↗</a></article>)}<h2>Analyse Ollama locale</h2><pre>{analysis||'Clique sur « Analyser IA » pour commencer.'}</pre></section></div><footer>Résultats bruts de l'annuaire. Vérifier les entreprises et les informations avant toute candidature. Aucun envoi automatique.</footer></main></div>;
}
