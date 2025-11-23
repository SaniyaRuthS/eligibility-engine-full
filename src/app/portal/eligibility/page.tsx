import { Suspense } from "react";
import { RulesForm } from "../../../components/eligibility/RulesForm";
import { FreezeCard } from "../../../components/eligibility/FreezeCard";
import { Card } from "../../../components/ui/card";
import { getEligibilityRulesAction } from "./actions";
import ShortlistClient from "./ShortlistClient";
import type { ShortlistRow } from "../../../components/eligibility/ShortlistTable";

async function fetchInitialData() {
  const rules = await getEligibilityRulesAction();
  const rows: ShortlistRow[] = [];
  return { rules, rows };
}

export default async function EligibilityPage() {
  const { rules, rows } = await fetchInitialData();

  return (
    <main className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Eligibility & Auto-Shortlisting</h1>
        <p className="text-sm text-slate-600">
          Configure eligibility rules, automatically shortlist students, lock the shortlist, and export.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.5fr,1fr]">
        <RulesForm initialRules={rules ?? undefined} />
        <FreezeCard />
      </div>

      <Suspense fallback={<Card>Loading shortlist...</Card>}>
        <ShortlistClient initialRows={rows} />
      </Suspense>
    </main>
  );
}
