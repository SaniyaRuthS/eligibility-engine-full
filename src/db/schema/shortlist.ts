import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const shortlistedStudents = pgTable("shortlisted_students", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull(),
  driveId: uuid("drive_id").notNull(),
  reason: text("reason"),
  isFrozen: boolean("is_frozen").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
