// lib/recommend.ts
import { CompanySchema, evaluateRules } from "./rules";

export function recommend(input: any) {
  const parsed = CompanySchema.parse({
    sector: input?.sector ?? "",
    size: input?.size ?? "Micro",
    state: input?.state,
    udyam: input?.udyam,
    turnoverCr:
      typeof input?.turnoverCr === "number"
        ? input.turnoverCr
        : input?.turnoverCr
        ? Number(input.turnoverCr)
        : undefined,
    compliance: Array.isArray(input?.compliance)
      ? input.compliance.map(String)
      : [],
  });

  return evaluateRules(parsed);
}
