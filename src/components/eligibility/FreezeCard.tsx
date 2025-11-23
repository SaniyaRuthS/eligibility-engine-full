"use client";

import { useTransition } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { freezeShortlistAction } from "../../app/portal/eligibility/actions";

export function FreezeCard() {
  const [isPending, startTransition] = useTransition();

  function onFreeze() {
    if (!confirm("Once frozen, the shortlist cannot be modified. Continue?")) return;
    startTransition(async () => {
      const res = await freezeShortlistAction();
      if (res.error) {
        alert(res.error);
      } else {
        alert("Shortlist frozen successfully.");
      }
    });
  }

  return (
    <Card className="border-amber-200 bg-amber-50/70">
      <h2 className="text-lg font-semibold text-amber-900">Freeze Shortlist</h2>
      <p className="mt-1 text-xs text-amber-800">
        Once you freeze the shortlist, it will be locked and cannot be changed for this drive.
      </p>
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={onFreeze}
          disabled={isPending}
        >
          {isPending ? "Freezing..." : "Freeze Shortlist"}
        </Button>
      </div>
    </Card>
  );
}
