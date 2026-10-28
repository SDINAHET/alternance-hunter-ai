import{useState}from 'react';
export default function SearchForm({onSearch}:{onSearch:(q:string,dep:string)=>void}){
 const[q,setQ]=useState('informatique');const[dep,setDep]=useState('56');
 return <form onSubmit={e=>{e.preventDefault();onSearch(q,dep)}} className="filters"><input aria-label="Mots-clés" value={q} onChange={e=>setQ(e.target.value)} placeholder="Compétences, entreprises…"/><select aria-label="Département" value={dep} onChange={e=>setDep(e.target.value)}>{['56','35','44','29','22'].map(x=><option key={x} value={x}>{x}</option>)}</select><button>Rechercher</button></form>;
}
