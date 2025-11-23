import { pgTable, uuid, text, numeric, integer, index } from "drizzle-orm/pg-core";

export const studentsMaster = pgTable(
  "students_master",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    rollNumber: text("roll_number").notNull(),

    // FIXED: numeric → number using $type<number>()
    cgpa: numeric("cgpa", { precision: 3, scale: 2 }).$type<number>().notNull(),
    tenth: numeric("tenth", { precision: 5, scale: 2 }).$type<number>().notNull(),
    twelfth: numeric("twelfth", { precision: 5, scale: 2 }).$type<number>().notNull(),

    arrears: integer("arrears").default(0).notNull(),
    department: text("department").notNull()
  },
  (table) => ({
    deptCgpaIdx: index("students_department_cgpa_idx").on(
      table.department,
      table.cgpa
    )
  })
);
