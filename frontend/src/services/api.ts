import type{Company,CompanyResults,Prospect,ProspectUpdate}from '../types/company';
import type{JobOffer}from '../types/job';
async function request<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch('/api'+path,init);if(r.status===204)return undefined as T;const data=await r.json();if(!r.ok)throw Error(data.error||'Erreur API');return data as T}
const post=(data:unknown)=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
export const api={
 companies:(q:string,department:string,page:number)=>request<CompanyResults>('/companies?'+new URLSearchParams({q,department,page:String(page)})),
 prospects:()=>request<Prospect[]>('/prospects'),
 save:(company:Company)=>request<Prospect>('/prospects',post(company)),
 update:(id:number,data:ProspectUpdate)=>request<Prospect>('/prospects/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),
 remove:(id:number)=>request<void>('/prospects/'+id,{method:'DELETE'}),
 analyze:(company:Company)=>request<{analysis:string}>('/ai/analyze',post({title:company.name,description:'Activité '+company.activity+' ; siège '+company.city})),
 models:()=>request<{installed:string[];writing:string;technical:string;embedding:string}>('/ai/models'),
 score:(profile:string,offer:string)=>request<{model:string;score:number;similarity:number;notice:string}>('/ai/score',post({profile,offer})),
 draft:(company:string,description:string,profile:string)=>request<{draft:string}>('/ai/draft',post({company,description,profile})),
 technical:(description:string)=>request<{analysis:string}>('/ai/technical',post({title:'Analyse technique',description})),
 jobs:()=>request<JobOffer[]>('/jobs'),
 jobsStatus:()=>request<{configured:boolean}>('/jobs/status'),
 refreshJobs:(keywords:string,department:string)=>request<{count:number;message:string}>('/jobs/refresh?'+new URLSearchParams({keywords,department}),{method:'POST'})
};
