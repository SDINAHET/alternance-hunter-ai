export interface Company {externalId:string;name:string;city:string;activity:string;sourceUrl:string}
export interface Prospect extends Company{id:number;status:string}
export interface CompanyResults{items:Company[];page:number;total:number}
