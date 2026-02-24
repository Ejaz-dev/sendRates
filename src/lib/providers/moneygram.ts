import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const moneygramAdapter: ProviderAdapter = {
  slug: "moneygram",
  name: "MoneyGram",
  logoUrl: "/logos/moneygram.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      const margin = 0.02; // ~2% typical margin
      const estimatedRate = midMarketRate * (1 - margin);
      const flatFee = request.sourceAmount <= 500 ? 1.99 : 4.99;
      const amountAfterFee = request.sourceAmount - flatFee;
      const totalReceived = amountAfterFee * estimatedRate;

      return {
        providerSlug: "moneygram",
        providerName: "MoneyGram",
        logoUrl: "/logos/moneygram.svg",
        exchangeRate: Math.round(estimatedRate * 10000) / 10000,
        midMarketRate,
        marginPercent: margin * 100,
        flatFee,
        totalReceived: Math.round(totalReceived * 100) / 100,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        sourceAmount: request.sourceAmount,
        deliveryTime: "1 to 3 days",
        deliveryMinutes: 240,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("MoneyGram adapter error:", error);
      return null;
    }
  },
};