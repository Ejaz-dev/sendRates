import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCachedRates, setCachedRates } from "@/lib/cache";
import { getAllQuotes } from "@/lib/providers";
import { ratelimit } from "@/lib/ratelimit";

const querySchema = z.object({
  source: z.string().length(3).toUpperCase(),
  target: z.string().length(3).toUpperCase(),
  amount: z.coerce.number().positive().max(100000),
});

export async function GET(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } }
    );
  }

  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { source, target, amount } = parsed.data;

  // Try cache first
  const cacheKey = { source, target, amount };
  const cached = await getCachedRates(cacheKey);
  if (cached) {
    return NextResponse.json({ quotes: cached, fromCache: true });
  }

  // Fetch fresh quotes
  try {
    const quotes = await getAllQuotes({
      sourceCurrency: source,
      targetCurrency: target,
      sourceAmount: amount,
    });

    await setCachedRates(cacheKey, quotes);

    return NextResponse.json({ quotes, fromCache: false });
  } catch (error) {
    console.error("Rate fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates. Please try again." },
      { status: 500 }
    );
  }
}