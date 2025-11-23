import { pgTable, uuid, numeric, boolean, timestamp, text } from "drizzle-orm/pg-core";

export const eligibilityRules = pgTable("eligibility_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  cgpaCutoff: numeric("cgpa_cutoff", { precision: 3, scale: 2 }),
  cutoff10th: numeric("cutoff_10th", { precision: 5, scale: 2 }),
  cutoff12th: numeric("cutoff_12th", { precision: 5, scale: 2 }),
  arrearsAllowed: boolean("arrears_allowed").notNull().default(false),
  allowedDepartments: text("allowed_departments").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
