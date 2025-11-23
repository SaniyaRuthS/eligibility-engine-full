import { z } from "zod";

export const eligibilityRulesSchema = z.object({
  cgpaCutoff: z.coerce.number().min(0).max(10),
  cutoff10th: z.coerce.number().min(0).max(100),
  cutoff12th: z.coerce.number().min(0).max(100),
  arrearsAllowed: z.coerce.boolean(),
  allowedDepartments: z.array(z.string()).min(1, "Select at least one department")
});

export type EligibilityRulesInput = z.infer<typeof eligibilityRulesSchema>;
