import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const paypalAdapter: ProviderAdapter = {
  slug: "paypal",
  name: "PayPal",
  logoUrl: "/logos/paypal.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      const margin = 0.035; // ~3.5% typical margin (PayPal is usually the most expensive)
      const estimatedRate = midMarketRate * (1 - margin);
      const flatFee = 2.99;
      const amountAfterFee = request.sourceAmount - flatFee;
      const totalReceived = amountAfterFee * estimatedRate;

      return {
        providerSlug: "paypal",
        providerName: "PayPal",
        logoUrl: "/logos/paypal.svg",
        exchangeRate: Math.round(estimatedRate * 10000) / 10000,
        midMarketRate,
        marginPercent: margin * 100,
        flatFee,
        totalReceived: Math.round(totalReceived * 100) / 100,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        sourceAmount: request.sourceAmount,
        deliveryTime: "Instant to 3 days",
        deliveryMinutes: 30,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("PayPal adapter error:", error);
      return null;
    }
  },
};