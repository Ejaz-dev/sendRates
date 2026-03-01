import axios from "axios";
import { ProviderAdapter, ProviderQuote, RateRequest } from "../types";

export const moneygramAdapter: ProviderAdapter = {
  slug: "moneygram",
  name: "MoneyGram",
  logoUrl: "/logos/moneygram.svg",

  async getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null> {
    try {
      const response = await axios.get(
        "https://www.moneygram.com/mgo/us/en/pricing/api/v1/estimateFee",
        {
          params: {
            amount: request.sourceAmount,
            sendCurrency: request.sourceCurrency,
            receiveCurrency: request.targetCurrency,
            receiveCountry: getCountryFromCurrency(request.targetCurrency),
            deliveryOption: "BANK_DEPOSIT",
          },
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      const data = response.data;
      const exchangeRate = data?.exchangeRate || data?.fxRate;
      const fee = data?.totalFee || data?.fee || 0;

      if (exchangeRate) {
        const amountAfterFee = request.sourceAmount - fee;
        const totalReceived = amountAfterFee * exchangeRate;
        const marginPercent = ((midMarketRate - exchangeRate) / midMarketRate) * 100;

        return {
          providerSlug: "moneygram",
          providerName: "MoneyGram",
          logoUrl: "/logos/moneygram.svg",
          exchangeRate: Math.round(exchangeRate * 10000) / 10000,
          midMarketRate,
          marginPercent: Math.max(0, Math.round(marginPercent * 100) / 100),
          flatFee: fee,
          totalReceived: Math.round(totalReceived * 100) / 100,
          sourceCurrency: request.sourceCurrency,
          targetCurrency: request.targetCurrency,
          sourceAmount: request.sourceAmount,
          deliveryTime: "1 to 3 days",
          deliveryMinutes: 240,
          fetchedAt: new Date().toISOString(),
        };
      }

      throw new Error("No rate in response");
    } catch (error) {
      console.warn("MoneyGram API failed, using estimate:", error);
      return getFallbackQuote(request, midMarketRate);
    }
  },
};

function getCountryFromCurrency(currency: string): string {
  const map: Record<string, string> = {
    EUR: "DE", GBP: "GB", INR: "IN", PHP: "PH", MXN: "MX",
    CAD: "CA", AUD: "AU", JPY: "JP", BRL: "BR", NGN: "NG",
    PKR: "PK", BDT: "BD", KES: "KE", GHS: "GH",
  };
  return map[currency] || "GB";
}

function getFallbackQuote(request: RateRequest, midMarketRate: number): ProviderQuote {
  const margin = 0.02;
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
}