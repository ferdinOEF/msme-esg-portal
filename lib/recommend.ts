import { CompanySchema, evaluateRules } from './rules'
export function recommend(input:any){const parsed=CompanySchema.parse({sector:input.sector,size:input.size,state:input.state,udyam:input.udyam,turnoverCr:typeof input.turnoverCr==='number'?input.turnoverCr:(input.turnoverCr?Number(input.turnoverCr):undefined),compliance:input.compliance||[]});return evaluateRules(parsed)}
