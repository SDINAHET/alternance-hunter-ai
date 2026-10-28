export interface Company {externalId:string;name:string;city:string;activity:string;sourceUrl:string}
export const STATUSES=['A_CONTACTER','CONTACT_TROUVE','CANDIDATURE_PREPAREE','CANDIDATURE_ENVOYEE','RELANCE','ENTRETIEN','REFUS','ACCEPTE'] as const;
export type Status=typeof STATUSES[number];
export interface Prospect extends Company{id:number;status:Status;notes:string|null;contactName:string|null;contactEmail:string|null;nextFollowUp:string|null}
export type ProspectUpdate=Pick<Prospect,'status'|'notes'|'contactName'|'contactEmail'|'nextFollowUp'>;
export interface CompanyResults{items:Company[];page:number;total:number}
