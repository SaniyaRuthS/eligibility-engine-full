"use server";

import { db, eligibilityRules, studentsMaster, shortlistedStudents } from "../../../db";
import { eligibilityRulesSchema, type EligibilityRulesInput } from "../../../lib/validation/eligibility";
import { eq, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEligibilityRulesAction() {
  const [row] = await db.select().from(eligibilityRules).limit(1);
  if (!row) return null;
  return {
    cgpaCutoff: Number(row.cgpaCutoff ?? 0),
    cutoff10th: Number(row.cutoff10th ?? 0),
    cutoff12th: Number(row.cutoff12th ?? 0),
    arrearsAllowed: row.arrearsAllowed ?? false,
    allowedDepartments: row.allowedDepartments ?? []
  } satisfies EligibilityRulesInput;
}

export async function saveEligibilityRulesAction(input: EligibilityRulesInput) {
  const parsed = eligibilityRulesSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  }
  const data = parsed.data;

  const existing = await db.select().from(eligibilityRules).limit(1);
  if (existing.length) {
    await db
      .update(eligibilityRules)
      .set({
        cgpaCutoff: data.cgpaCutoff,
        cutoff10th: data.cutoff10th,
        cutoff12th: data.cutoff12th,
        arrearsAllowed: data.arrearsAllowed,
        allowedDepartments: data.allowedDepartments
      })
      .where(eq(eligibilityRules.id, existing[0].id));
  } else {
    await db.insert(eligibilityRules).values({
      cgpaCutoff: data.cgpaCutoff,
      cutoff10th: data.cutoff10th,
      cutoff12th: data.cutoff12th,
      arrearsAllowed: data.arrearsAllowed,
      allowedDepartments: data.allowedDepartments
    });
  }

  revalidatePath("/portal/eligibility");
  return { ok: true };
}

export type ShortlistResultRow = {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  cgpa: number;
  eligible: boolean;
  reason: string | null;
};

export async function runAutoShortlistAction(): Promise<
  | { error: string }
  | { ok: true; rows: ShortlistResultRow[]; eligibleCount: number; ineligibleCount: number }
> {
  const rules = await getEligibilityRulesAction();
  if (!rules) {
    return { error: "Please configure eligibility rules first." };
  }

  const students = await db
    .select()
    .from(studentsMaster)
    .where(
      and(
        gte(studentsMaster.cgpa, rules.cgpaCutoff),
        gte(studentsMaster.tenth, rules.cutoff10th),
        gte(studentsMaster.twelfth, rules.cutoff12th)
      )
    );

  const rows: ShortlistResultRow[] = [];

  for (const s of students) {
    const cgpa = Number(s.cgpa ?? 0);
    const tenth = Number(s.tenth ?? 0);
    const twelfth = Number(s.twelfth ?? 0);
    const arrears = s.arrears ?? 0;
    let eligible = true;
    let reason: string | null = null;

    if (cgpa < rules.cgpaCutoff) {
      eligible = false;
      reason = "CGPA < required";
    } else if (tenth < rules.cutoff10th) {
      eligible = false;
      reason = "10th marks below cutoff";
    } else if (twelfth < rules.cutoff12th) {
      eligible = false;
      reason = "12th marks below cutoff";
    } else if (!rules.arrearsAllowed && arrears > 0) {
      eligible = false;
      reason = "Arrears not allowed";
    } else if (!rules.allowedDepartments.includes(s.department)) {
      eligible = false;
      reason = "Department not eligible";
    }

    rows.push({
      id: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      department: s.department,
      cgpa,
      eligible,
      reason
    });
  }

  const eligibleRows = rows.filter((r) => r.eligible);

  const driveId = "00000000-0000-0000-0000-000000000001";

  await db
    .delete(shortlistedStudents)
    .where(eq(shortlistedStudents.driveId, driveId as any));

  if (eligibleRows.length) {
    await db.insert(shortlistedStudents).values(
      eligibleRows.map((r) => ({
        studentId: r.id as any,
        driveId: driveId as any,
        reason: null,
        isFrozen: false
      }))
    );
  }

  revalidatePath("/portal/eligibility");
  return {
    ok: true,
    rows,
    eligibleCount: eligibleRows.length,
    ineligibleCount: rows.length - eligibleRows.length
  };
}

export async function freezeShortlistAction() {
  const driveId = "00000000-0000-0000-0000-000000000001";

  const existing = await db
    .select()
    .from(shortlistedStudents)
    .where(eq(shortlistedStudents.driveId, driveId as any))
    .limit(1);

  if (existing.length && existing[0].isFrozen) {
    return { error: "Shortlist is already frozen." };
  }

  await db
    .update(shortlistedStudents)
    .set({ isFrozen: true })
    .where(eq(shortlistedStudents.driveId, driveId as any));

  revalidatePath("/portal/eligibility");
  return { ok: true };
}
