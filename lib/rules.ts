import { z } from 'zod'
export const CompanySchema=z.object({sector:z.string(),size:z.enum(['Micro','Small','Medium']),state:z.string(),udyam:z.string().optional(),turnoverCr:z.number().optional(),compliance:z.array(z.string())});
export function evaluateRules(c:any){const out={mandatory:[],optional:[],schemes:[],actions30:[],actions60:[],actions90:[] as string[]};const push=(t:string,a:string)=>{(out as any)[t].push(a)};
if(!c.compliance.includes('consents:valid')) push('mandatory','Obtain/renew SPCB Consent to Operate (Air/Water Acts)');
push('mandatory','Hazardous & Other Wastes rules compliance (if applicable)');push('mandatory','OSH & Fire NOC compliance');
if(['Micro','Small'].includes(c.size)){out.schemes.push('TEAM','ZED','GIFT','SIDBI-4E');}
if(/food|beverage/i.test(c.sector)) push('mandatory','Effluent treatment and FSSAI hygiene compliances');
if(/chem|pharma/i.test(c.sector)){push('mandatory','Hazardous chemicals storage, MSDS, EPR (where applicable)');push('optional','Apply for SPICE (circular economy CAPEX subsidy)');}
if(c.state?.toLowerCase()==='goa'){push('mandatory','GSPCB CTO (Air/Water); verify sector-specific limits & validity');}
['ISO 14001 (Env. Mgmt.)','ISO 45001 (OHS)','ISO 50001 (Energy)','BRSR Lite (supplier readiness)'].forEach(x=>push('optional',x));
['Baseline audit (energy/water/waste); legal compliance check','Start ZED Bronze self-assessment; close top non-conformities'].forEach(x=>push('actions30',x));
['Register for TEAM (if MSE); prepare ONDC catalogue','Energy audit (4E or equivalent); identify quick-win retrofits'].forEach(x=>push('actions60',x));
['Apply for GIFT financing for green CAPEX','Implement ISO 14001 lite; training & internal audit'].forEach(x=>push('actions90',x));
return out;}
