import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const remitlyAdapter: ProviderAdapter = {
  slug: "remitly",
  name: "Remitly",
  logoUrl: "/logos/remitly.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      // Remitly doesn't have a public API, so we use estimated rates.
      // In production, you'd scrape their pricing page or use a
      // third-party aggregator API for real-time data.
      const margin = 0.015; // ~1.5% typical margin
      const estimatedRate = midMarketRate * (1 - margin);
      const flatFee = request.sourceAmount <= 500 ? 3.99 : 0;
      const amountAfterFee = request.sourceAmount - flatFee;
      const totalReceived = amountAfterFee * estimatedRate;

      return {
        providerSlug: "remitly",
        providerName: "Remitly",
        logoUrl: "/logos/remitly.svg",
        exchangeRate: Math.round(estimatedRate * 10000) / 10000,
        midMarketRate,
        marginPercent: margin * 100,
        flatFee,
        totalReceived: Math.round(totalReceived * 100) / 100,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        sourceAmount: request.sourceAmount,
        deliveryTime: "Minutes to 3 days",
        deliveryMinutes: 120,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Remitly adapter error:", error);
      return null;
    }
  },
};