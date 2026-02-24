import axios from "axios";
import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

const WISE_API = "https://api.wise.com";

export const wiseAdapter: ProviderAdapter = {
  slug: "wise",
  name: "Wise",
  logoUrl: "/logos/wise.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      const rateRes = await axios.get(`${WISE_API}/v1/rates`, {
        params: { source: request.sourceCurrency, target: request.targetCurrency },
        headers: { Authorization: `Bearer ${process.env.WISE_API_TOKEN}` },
      });

      const wiseRate = rateRes.data[0]?.rate;
      if (!wiseRate) return null;

      const flatFee = estimateWiseFee(request.sourceAmount, request.sourceCurrency);
      const amountAfterFee = request.sourceAmount - flatFee;
      const totalReceived = amountAfterFee * wiseRate;
      const marginPercent = ((midMarketRate - wiseRate) / midMarketRate) * 100;

      return {
        providerSlug: "wise",
        providerName: "Wise",
        logoUrl: "/logos/wise.svg",
        exchangeRate: wiseRate,
        midMarketRate,
        marginPercent: Math.max(0, marginPercent),
        flatFee,
        totalReceived: Math.round(totalReceived * 100) / 100,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        sourceAmount: request.sourceAmount,
        deliveryTime: "Minutes to 1 day",
        deliveryMinutes: 60,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Wise API error:", error);
      return null;
    }
  },
};

function estimateWiseFee(amount: number, currency: string): number {
  if (currency === "USD") {
    if (amount <= 500) return 3.69;
    if (amount <= 1000) return 5.32;
    return amount * 0.0052;
  }
  return amount * 0.006;
}
