async function getJson(url, options={}) {
 const res=await fetch(url,{...options,signal:AbortSignal.timeout(12000)});
 if(!res.ok) throw new Error(`Source returned HTTP ${res.status}`);
 return res.json();
}
function clean(v,max=100){return String(v||'').trim().slice(0,max);}
export async function searchCompanies(params){
 const q=clean(params.get('q')||'informatique');
 const department=clean(params.get('department')||'35',3);
 if(!/^\d{2,3}$/.test(department)) throw new Error('Invalid department');
 const u=new URL('https://recherche-entreprises.api.gouv.fr/search');
 u.searchParams.set('q',q);u.searchParams.set('departement',department);u.searchParams.set('per_page','20');
 const data=await getJson(u);
 return {source:'API Recherche d’entreprises',items:(data.results||[]).map(x=>({id:`siren:${x.siren}`,name:x.nom_complet||x.nom_raison_sociale||'Entreprise',city:x.siege?.libelle_commune||'',description:x.activite_principale||'',url:`https://annuaire-entreprises.data.gouv.fr/entreprise/${x.siren}`,kind:'company'})),total:data.total_results||0};
}
let tokenCache={token:null,expires:0};
async function ftToken(){
 const id=process.env.FRANCE_TRAVAIL_CLIENT_ID,secret=process.env.FRANCE_TRAVAIL_CLIENT_SECRET;
 if(!id||!secret)return null;
 if(tokenCache.token&&Date.now()<tokenCache.expires)return tokenCache.token;
 const body=new URLSearchParams({grant_type:'client_credentials',client_id:id,client_secret:secret,scope:process.env.FRANCE_TRAVAIL_SCOPE||'api_offresdemploiv2 o2dsoffre'});
 const data=await getJson('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
 tokenCache={token:data.access_token,expires:Date.now()+Math.max(30,Number(data.expires_in||300)-30)*1000};return tokenCache.token;
}
export async function searchJobs(params){
 const token=await ftToken();
 if(!token)return {source:'France Travail',configured:false,items:[],message:'Configurer les identifiants API France Travail pour activer cette source.'};
 const u=new URL('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search');
 u.searchParams.set('motsCles',clean(params.get('q')||'développeur alternance'));u.searchParams.set('range','0-19');
 const dep=clean(params.get('department')||'35',3);if(/^\d{2,3}$/.test(dep))u.searchParams.set('departement',dep);
 const data=await getJson(u,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
 return {source:'France Travail',configured:true,items:(data.resultats||[]).map(x=>({id:`ft:${x.id}`,name:x.intitule,city:x.lieuTravail?.libelle||'',description:x.description?.slice(0,350)||'',url:x.origineOffre?.urlOrigine||`https://candidat.francetravail.fr/offres/recherche/detail/${x.id}`,kind:'job',company:x.entreprise?.nom||'',contract:x.typeContrat||''})),total:(data.resultats||[]).length};
}
