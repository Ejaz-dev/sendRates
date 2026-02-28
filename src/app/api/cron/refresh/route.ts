import { NextRequest, NextResponse } from "next/server";
import { rateQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await rateQueue.add("refresh-all", {}, { jobId: `refresh-${Date.now()}` });

  return NextResponse.json({ message: "Refresh job queued" });
}