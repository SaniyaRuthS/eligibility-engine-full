import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db, studentsMaster } from "@/db";

export async function GET() {
  const students = await db.select().from(studentsMaster);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Shortlisted");

  sheet.columns = [
    { header: "Roll Number", key: "rollNumber" },
    { header: "Name", key: "name" },
    { header: "Department", key: "department" },
    { header: "CGPA", key: "cgpa" },
  ];

  students.forEach((s) => sheet.addRow(s));

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=shortlisted.xlsx",
    },
  });
}
