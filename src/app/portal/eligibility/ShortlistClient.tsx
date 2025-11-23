"use client";

import { useState } from "react";
import { runAutoShortlistAction } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShortlistTable, ShortlistRow } from "@/components/eligibility/ShortlistTable";

export default function ShortlistClient({ initialRows }: { initialRows: ShortlistRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);

  async function runShortlisting() {
    setLoading(true);
    const result = await runAutoShortlistAction();

    if ("ok" in result) {
      setRows(result.rows);
    } else {
      alert(result.error);
    }

    setLoading(false);
  }

  // ⭐ Force download without navigating
  function downloadFile(path: string) {
    const a = document.createElement("a");
    a.href = path;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="space-y-6">

      {/* RUN SHORTLIST CARD */}
      <Card className="p-4 flex justify-between items-center">
        <p className="text-slate-600 text-sm">
          Run the auto-shortlisting engine to see eligible & ineligible students.
        </p>
        <Button onClick={runShortlisting} disabled={loading}>
          {loading ? "Running..." : "Run Shortlist"}
        </Button>
      </Card>

      {/* SHORTLIST RESULTS TABLE */}
      <ShortlistTable rows={rows} />

      {/* ⭐ EXPORT BUTTONS REMOVED AS REQUESTED */}
    </div>
  );
}
