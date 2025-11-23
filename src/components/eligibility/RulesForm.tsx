"use client";

import { useState, useTransition } from "react";
import { eligibilityRulesSchema, type EligibilityRulesInput } from "../../lib/validation/eligibility";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { saveEligibilityRulesAction } from "../../app/portal/eligibility/actions";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

interface RulesFormProps {
  initialRules?: Partial<EligibilityRulesInput>;
}

export function RulesForm({ initialRules }: RulesFormProps) {
  const [rules, setRules] = useState<EligibilityRulesInput>({
    cgpaCutoff: initialRules?.cgpaCutoff ?? 7,
    cutoff10th: initialRules?.cutoff10th ?? 60,
    cutoff12th: initialRules?.cutoff12th ?? 60,
    arrearsAllowed: initialRules?.arrearsAllowed ?? false,
    allowedDepartments: initialRules?.allowedDepartments ?? ["CSE", "IT"]
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleDept(dept: string) {
    setRules((prev) => {
      const exists = prev.allowedDepartments.includes(dept);
      const next = exists
        ? prev.allowedDepartments.filter((d) => d !== dept)
        : [...prev.allowedDepartments, dept];
      return { ...prev, allowedDepartments: next };
    });
  }

  function handleChange(field: keyof EligibilityRulesInput, value: any) {
    setRules((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = eligibilityRulesSchema.safeParse(rules);
    if (!parsed.success) {
      setErrors(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setErrors(null);

    startTransition(async () => {
      const res = await saveEligibilityRulesAction(parsed.data);
      if (res.error) {
        setErrors(res.error);
      } else {
        setErrors(null);
        alert("Eligibility rules saved.");
      }
    });
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Eligibility Rules Setup</h2>
          <span className="text-xs text-slate-500">Configure CGPA, marks, arrears, departments</span>
        </div>

        {errors && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            {errors}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-slate-600">CGPA Cutoff</label>
            <Input
              type="number"
              step="0.01"
              value={rules.cgpaCutoff}
              onChange={(e) => handleChange("cgpaCutoff", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">10th Cutoff (%)</label>
            <Input
              type="number"
              step="0.1"
              value={rules.cutoff10th}
              onChange={(e) => handleChange("cutoff10th", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">12th Cutoff (%)</label>
            <Input
              type="number"
              step="0.1"
              value={rules.cutoff12th}
              onChange={(e) => handleChange("cutoff12th", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-slate-700">Arrears Allowed</p>
            <p className="text-xs text-slate-500">
              If disabled, any student with arrears will be marked ineligible.
            </p>
          </div>
          <Switch
            checked={rules.arrearsAllowed}
            onCheckedChange={(v) => handleChange("arrearsAllowed", v)}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-slate-600">Allowed Departments</p>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => {
              const active = rules.allowedDepartments.includes(dept);
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className="focus:outline-none"
                >
                  <Badge
                    className={
                      active
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {dept}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Rules"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
