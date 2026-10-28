import type{Company,CompanyResults,Prospect,ProspectUpdate}from '../types/company';
async function request<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch('/api'+path,init);if(r.status===204)return undefined as T;const data=await r.json();if(!r.ok)throw Error(data.error||'Erreur API');return data as T}
export const api={
 companies:(q:string,department:string,page:number)=>request<CompanyResults>('/companies?'+new URLSearchParams({q,department,page:String(page)})),
 prospects:()=>request<Prospect[]>('/prospects'),
 save:(company:Company)=>request<Prospect>('/prospects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(company)}),
 update:(id:number,data:ProspectUpdate)=>request<Prospect>('/prospects/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),
 remove:(id:number)=>request<void>('/prospects/'+id,{method:'DELETE'}),
 analyze:(company:Company)=>request<{analysis:string}>('/ai/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:company.name,description:'Activité '+company.activity+' ; siège '+company.city})})
};
