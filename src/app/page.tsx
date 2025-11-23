import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Eligibility & Auto-Shortlisting Engine</h1>
      <p className="text-slate-600">
        Go to the eligibility module to configure rules and run auto-shortlisting.
      </p>
      <Link
        href="/portal/eligibility"
        className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Open Eligibility Module
      </Link>
    </main>
  );
}
