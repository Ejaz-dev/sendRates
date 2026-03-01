import axios from "axios";
import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const remitlyAdapter: ProviderAdapter = {
  slug: "remitly",
  name: "Remitly",
  logoUrl: "/logos/remitly.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      // Remitly's internal pricing endpoint
      const response = await axios.get(
        "https://www.remitly.com/ng-api/v3/us/en/pricing/estimate",
        {
          params: {
            amount: request.sourceAmount,
            sourceCurrency: request.sourceCurrency,
            destinationCurrency: request.targetCurrency,
            corridor: `${request.sourceCurrency}${request.targetCurrency}`,
          },
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      const data = response.data;
      const exchangeRate = data?.exchangeRate || data?.rate;
      const fee = data?.fee || data?.transferFee || 0;

      if (exchangeRate) {
        const amountAfterFee = request.sourceAmount - fee;
        const totalReceived = amountAfterFee * exchangeRate;
        const marginPercent = ((midMarketRate - exchangeRate) / midMarketRate) * 100;

        return {
          providerSlug: "remitly",
          providerName: "Remitly",
          logoUrl: "/logos/remitly.svg",
          exchangeRate: Math.round(exchangeRate * 10000) / 10000,
          midMarketRate,
          marginPercent: Math.max(0, Math.round(marginPercent * 100) / 100),
          flatFee: fee,
          totalReceived: Math.round(totalReceived * 100) / 100,
          sourceCurrency: request.sourceCurrency,
          targetCurrency: request.targetCurrency,
          sourceAmount: request.sourceAmount,
          deliveryTime: "Minutes to 3 days",
          deliveryMinutes: 120,
          fetchedAt: new Date().toISOString(),
        };
      }

      throw new Error("No rate in response");
    } catch (error) {
      console.warn("Remitly API failed, using estimate:", error);
      return getFallbackQuote(request, midMarketRate);
    }
  },
};

function getFallbackQuote(request: RateRequest, midMarketRate: number): ProviderQuote {
  const margin = 0.015;
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
}