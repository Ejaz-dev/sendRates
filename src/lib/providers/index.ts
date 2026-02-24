import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";
import { getMidMarketRate } from "./exchangerate-api";
import { wiseAdapter } from "./wise";
import { remitlyAdapter } from "./remitly";
import { westernUnionAdapter } from "./western-union";
import { moneygramAdapter } from "./moneygram";
import { paypalAdapter } from "./paypal";

const adapters: ProviderAdapter[] = [
  wiseAdapter,
  remitlyAdapter,
  westernUnionAdapter,
  moneygramAdapter,
  paypalAdapter,
];

export async function getAllQuotes(request: RateRequest): Promise<ProviderQuote[]> {
  // 1. Get the true mid-market rate as baseline
  const midMarketRate = await getMidMarketRate(
    request.sourceCurrency,
    request.targetCurrency
  );

  if (!midMarketRate) {
    throw new Error(
      `Could not fetch mid-market rate for ${request.sourceCurrency} → ${request.targetCurrency}`
    );
  }

  // 2. Fetch all provider quotes in parallel
  const results = await Promise.allSettled(
    adapters.map((adapter) => adapter.getQuote(request, midMarketRate))
  );

  // 3. Collect successful quotes
  const quotes: ProviderQuote[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      quotes.push(result.value);
    } else {
      console.warn(`Provider ${adapters[index].slug} failed:`, result);
    }
  });

  // 4. Sort by best value (highest totalReceived)
  quotes.sort((a, b) => b.totalReceived - a.totalReceived);

  return quotes;
}