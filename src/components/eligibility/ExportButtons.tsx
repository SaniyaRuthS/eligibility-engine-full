"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButtons() {
  const download = (type: "pdf" | "excel") => {
    const a = document.createElement("a");
    a.href = `/portal/eligibility/export/${type}`;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex gap-3 mt-6">
      <Button variant="outline" onClick={() => download("excel")}>
        <Download className="mr-2 h-4 w-4" /> Export Excel
      </Button>

      <Button variant="outline" onClick={() => download("pdf")}>
        <Download className="mr-2 h-4 w-4" /> Export PDF
      </Button>
    </div>
  );
}
