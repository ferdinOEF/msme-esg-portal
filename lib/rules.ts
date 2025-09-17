// lib/rules.ts
import { z } from "zod";

export const CompanySchema = z.object({
  sector: z.string().default(""),
  size: z.enum(["Micro", "Small", "Medium", "Large"]).default("Micro"),
  state: z.string().optional(),
  udyam: z.string().optional(),
  turnoverCr: z.number().optional(),
  compliance: z.array(z.string()).default([]),
});
export type Company = z.infer<typeof CompanySchema>;

export type Recommendation = {
  mandatory: string[];
  optional: string[];
  schemes: string[];
};

export function evaluateRules(c: Company): Recommendation {
  const out: Recommendation = { mandatory: [], optional: [], schemes: [] };

  const push = (bucket: keyof Recommendation, msg: string) => {
    if (!out[bucket].includes(msg)) out[bucket].push(msg);
  };

  // Generic compliance checks
  if (!c.compliance.includes("consents:valid")) {
    push("mandatory", "Obtain/renew SPCB Consent to Operate (Air/Water Acts)");
  }
  push("mandatory", "Hazardous & Other Wastes rules compliance (if applicable)");
  push("mandatory", "OSH & Fire NOC compliance");

  // Size-based scheme nudge
  if (["Micro", "Small"].includes(c.size)) {
    out.schemes.push("TEAM", "ZED", "GIFT", "SIDBI-4E");
  }

  // Sector heuristics
  if (/food|beverage/i.test(c.sector)) {
    push("mandatory", "Effluent treatment and FSSAI hygiene compliances");
  }
  if (/chem|pharma/i.test(c.sector)) {
    push("mandatory", "Hazardous chemicals storage, MSDS, EPR (where applicable)");
    push("optional", "Apply for SPICE (circular economy CAPEX subsidy)");
  }

  // State-specific (Goa sample)
  if (c.state?.toLowerCase() === "goa") {
    push("mandatory", "GSPCB CTO (Air/Water); verify sector-specific limits & validity");
    out.schemes.push("Goa — ZED Top-up");
  }

  return out;
}
