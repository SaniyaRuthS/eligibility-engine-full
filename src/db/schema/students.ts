import { pgTable, uuid, text, numeric, integer, index } from "drizzle-orm/pg-core";

export const studentsMaster = pgTable(
  "students_master",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    rollNumber: text("roll_number").notNull(),
    cgpa: numeric("cgpa", { precision: 3, scale: 2 }),
    tenth: numeric("tenth", { precision: 5, scale: 2 }),
    twelfth: numeric("twelfth", { precision: 5, scale: 2 }),
    arrears: integer("arrears").default(0),
    department: text("department").notNull()
  },
  (table) => ({
    deptCgpaIdx: index("students_department_cgpa_idx").on(table.department, table.cgpa)
  })
);
