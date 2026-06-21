import { NextResponse } from "next/server";

// In-memory store for mock leaves to demonstrate workflow
// Note: In Next.js dev mode, this might reset occasionally, but it's fine for testing the UI flow.
let mockLeaves = [
  { id: "LR-001", employeeName: "Rahul Sharma", type: "Casual Leave", days: 3, startDate: "2026-06-24", endDate: "2026-06-26", status: "PENDING", reason: "Family trip" },
  { id: "LR-002", employeeName: "Rahul Sharma", type: "Sick Leave", days: 1, startDate: "2026-05-10", endDate: "2026-05-10", status: "APPROVED", reason: "Fever" },
];

export async function GET() {
  return NextResponse.json(mockLeaves, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const newLeave = {
    id: `LR-00${mockLeaves.length + 1}`,
    employeeName: body.employeeName || "Rahul Sharma",
    type: body.type,
    days: body.days,
    startDate: body.startDate,
    endDate: body.endDate,
    status: body.status || "PENDING",
    reason: body.reason
  };

  mockLeaves.unshift(newLeave);

  return NextResponse.json(newLeave, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const index = mockLeaves.findIndex(l => l.id === body.id);
  if (index !== -1) {
    mockLeaves[index] = { ...mockLeaves[index], status: body.status };
  }
  return NextResponse.json({ success: true }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
