import { pgTable, uuid, numeric, boolean, timestamp, text } from "drizzle-orm/pg-core";

export const eligibilityRules = pgTable("eligibility_rules", {
  id: uuid("id").primaryKey().defaultRandom(),

  // FIXED: Cast numeric to number using .$type<number>()
  cgpaCutoff: numeric("cgpa_cutoff", { precision: 3, scale: 2 })
    .$type<number>()
    .notNull(),

  cutoff10th: numeric("cutoff_10th", { precision: 5, scale: 2 })
    .$type<number>()
    .notNull(),

  cutoff12th: numeric("cutoff_12th", { precision: 5, scale: 2 })
    .$type<number>()
    .notNull(),

  arrearsAllowed: boolean("arrears_allowed").notNull().default(false),

  // FIXED: Department array should always be a string array
  allowedDepartments: text("allowed_departments").array().notNull().default([]),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
