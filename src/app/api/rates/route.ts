import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCachedRates, setCachedRates } from "@/lib/cache";
import { getAllQuotes } from "@/lib/providers";

const querySchema = z.object({
  source: z.string().length(3).toUpperCase(),
  target: z.string().length(3).toUpperCase(),
  amount: z.coerce.number().positive().max(100000),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { source, target, amount } = parsed.data;

  // 1. Try cache first
  const cacheKey = { source, target, amount };
  const cached = await getCachedRates(cacheKey);
  if (cached) {
    return NextResponse.json({ quotes: cached, fromCache: true });
  }

  // 2. Fetch fresh quotes
  try {
    const quotes = await getAllQuotes({
      sourceCurrency: source,
      targetCurrency: target,
      sourceAmount: amount,
    });

    // 3. Cache the results
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