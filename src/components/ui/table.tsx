import * as React from "react";
import { cn } from "../../lib/utils";

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("min-w-full divide-y divide-slate-200 text-left text-sm", props.className)}
      {...props}
    />
  );
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-slate-50 text-xs font-semibold uppercase" {...props} />;
}

export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-slate-200" {...props} />;
}

export function TR(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}

export function TH(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-3 py-2 font-semibold text-slate-600" {...props} />;
}

export function TD(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-3 py-2 text-slate-700" {...props} />;
}
