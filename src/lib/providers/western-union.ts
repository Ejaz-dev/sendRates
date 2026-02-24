import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const westernUnionAdapter: ProviderAdapter = {
  slug: "western-union",
  name: "Western Union",
  logoUrl: "/logos/western-union.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      const margin = 0.025; // ~2.5% typical margin
      const estimatedRate = midMarketRate * (1 - margin);
      const flatFee = request.sourceAmount <= 1000 ? 4.99 : 7.99;
      const amountAfterFee = request.sourceAmount - flatFee;
      const totalReceived = amountAfterFee * estimatedRate;

      return {
        providerSlug: "western-union",
        providerName: "Western Union",
        logoUrl: "/logos/western-union.svg",
        exchangeRate: Math.round(estimatedRate * 10000) / 10000,
        midMarketRate,
        marginPercent: margin * 100,
        flatFee,
        totalReceived: Math.round(totalReceived * 100) / 100,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        sourceAmount: request.sourceAmount,
        deliveryTime: "Minutes to 5 days",
        deliveryMinutes: 180,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Western Union adapter error:", error);
      return null;
    }
  },
};