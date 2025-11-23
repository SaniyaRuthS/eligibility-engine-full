import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Eligibility Engine",
  description: "Eligibility & Auto-Shortlisting Engine"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
