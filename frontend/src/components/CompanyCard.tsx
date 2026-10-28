import type{Company}from '../types/company';
export default function CompanyCard({company,onSave,onAnalyze,saved}:{company:Company;saved:boolean;onSave:(x:Company)=>void;onAnalyze:(x:Company)=>void}){
 return <article className="company"><div><h3>{company.name}</h3><p>{company.city||'Siège non renseigné'} · NAF {company.activity||'N/A'}</p></div><div className="actions"><a href={company.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a><button disabled={saved} onClick={()=>onSave(company)}>{saved?'Déjà enregistré':'Enregistrer'}</button><button onClick={()=>onAnalyze(company)}>Analyser IA</button></div></article>;
}
