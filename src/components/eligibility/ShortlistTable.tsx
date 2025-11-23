import { Table, THead, TBody, TR, TH, TD } from "../ui/table";
import { Card } from "../ui/card";

export interface ShortlistRow {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  cgpa: number;
  eligible: boolean;
  reason: string | null;
}

interface ShortlistTableProps {
  rows: ShortlistRow[];
}

export function ShortlistTable({ rows }: ShortlistTableProps) {
  if (!rows.length) {
    return (
      <Card className="text-sm text-slate-500 p-4">
        Run the auto-shortlisting engine to see eligible and ineligible students.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-lg font-semibold">Shortlisting Results</h2>

      <div className="max-h-96 overflow-auto rounded-2xl border border-slate-100">
        <Table>
          <THead>
            <TR>
              <TH>Roll No</TH>
              <TH>Name</TH>
              <TH>Dept</TH>
              <TH>CGPA</TH>
              <TH>Status</TH>
              <TH>Reason (if ineligible)</TH>
            </TR>
          </THead>

          <TBody>
            {rows.map((row) => (
              <TR key={row.id}>
                <TD>{row.rollNumber}</TD>
                <TD>{row.name}</TD>
                <TD>{row.department}</TD>
                <TD>{row.cgpa}</TD>
                <TD>
                  <span
                    className={
                      row.eligible
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                    }
                  >
                    {row.eligible ? "Eligible" : "Ineligible"}
                  </span>
                </TD>
                <TD className="text-xs text-slate-600">{row.reason ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </Card>
  );
}
