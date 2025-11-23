import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { db } from "@/db";
import { shortlistedStudents } from "@/db/schema/shortlist";
import { studentsMaster } from "@/db/schema/students";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const driveId = "00000000-0000-0000-0000-000000000001";

    // Fetch shortlisted students
    const data = await db
      .select({
        id: studentsMaster.id,
        name: studentsMaster.name,
        rollNumber: studentsMaster.rollNumber,
        department: studentsMaster.department,
        cgpa: studentsMaster.cgpa,
      })
      .from(shortlistedStudents)
      .innerJoin(
        studentsMaster,
        eq(shortlistedStudents.studentId, studentsMaster.id)
      )
      .where(eq(shortlistedStudents.driveId, driveId));

    // PDF creation
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => {});

    doc.fontSize(20).text("Shortlisted Students", { underline: true });
    doc.moveDown();

    data.forEach((s) => {
      doc
        .fontSize(12)
        .text(`${s.rollNumber} - ${s.name} (${s.department}) | CGPA: ${s.cgpa}`);
    });

    doc.end();

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="shortlisted.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
