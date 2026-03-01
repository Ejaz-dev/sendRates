import axios from "axios";
import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const paypalAdapter: ProviderAdapter = {
  slug: "paypal",
  name: "PayPal",
  logoUrl: "/logos/paypal.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      // PayPal's internal rate check endpoint
      const response = await axios.get(
        "https://www.paypal.com/myaccount/transfer/fx/rates",
        {
          params: {
            fromCurrency: request.sourceCurrency,
            toCurrency: request.targetCurrency,
            amount: request.sourceAmount,
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
          providerSlug: "paypal",
          providerName: "PayPal",
          logoUrl: "/logos/paypal.svg",
          exchangeRate: Math.round(exchangeRate * 10000) / 10000,
          midMarketRate,
          marginPercent: Math.max(0, Math.round(marginPercent * 100) / 100),
          flatFee: fee,
          totalReceived: Math.round(totalReceived * 100) / 100,
          sourceCurrency: request.sourceCurrency,
          targetCurrency: request.targetCurrency,
          sourceAmount: request.sourceAmount,
          deliveryTime: "Instant to 3 days",
          deliveryMinutes: 30,
          fetchedAt: new Date().toISOString(),
        };
      }

      throw new Error("No rate in response");
    } catch (error) {
      console.warn("PayPal API failed, using estimate:", error);
      return getFallbackQuote(request, midMarketRate);
    }
  },
};

function getFallbackQuote(request: RateRequest, midMarketRate: number): ProviderQuote {
  const margin = 0.035;
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
}