"use client";

import { useState, useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { ShortlistTable, type ShortlistRow } from "../../../components/eligibility/ShortlistTable";
import { runAutoShortlistAction } from "./actions";

export default function ShortlistClient({ initialRows }: { initialRows: ShortlistRow[] }) {
  const [rows, setRows] = useState<ShortlistRow[]>(initialRows);
  const [summary, setSummary] = useState<{ eligible: number; ineligible: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  function onRun() {
    startTransition(async () => {
      const res = await runAutoShortlistAction();
      if ("error" in res) {
        alert(res.error);
        return;
      }
      setRows(res.rows);
      setSummary({ eligible: res.eligibleCount, ineligible: res.ineligibleCount });
    });
  }

  return (
    <div className="space-y-3">
      <Card className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Auto Shortlisting</h2>
          <p className="text-xs text-slate-500">
            The system will filter students from the master data using the configured rules.
          </p>
        </div>
        <Button type="button" onClick={onRun} disabled={isPending}>
          {isPending ? "Running..." : "Run Shortlist"}
        </Button>
      </Card>

      {summary && (
        <Card className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-500">Eligible Students</p>
            <p className="text-xl font-semibold text-emerald-700">{summary.eligible}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Ineligible Students</p>
            <p className="text-xl font-semibold text-rose-700">{summary.ineligible}</p>
          </div>
        </Card>
      )}

      <ShortlistTable rows={rows} />
    </div>
  );
}
