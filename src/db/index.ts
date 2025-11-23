import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as eligibilitySchema from "./schema/eligibility";
import * as studentsSchema from "./schema/students";
import * as shortlistSchema from "./schema/shortlist";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, {
  schema: {
    ...eligibilitySchema,
    ...studentsSchema,
    ...shortlistSchema
  }
});

export * from "./schema/eligibility";
export * from "./schema/students";
export * from "./schema/shortlist";
