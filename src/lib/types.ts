export interface ProviderQuote {
  providerSlug: string;
  providerName: string;
  logoUrl: string;
  exchangeRate: number;
  midMarketRate: number;
  marginPercent: number;
  flatFee: number;
  totalReceived: number;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  deliveryTime: string;
  deliveryMinutes: number | null;
  fetchedAt: string;
}

export interface RateRequest {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
}

export interface ProviderAdapter {
  slug: string;
  name: string;
  logoUrl: string;
  getQuote(request: RateRequest, midMarketRate: number): Promise<ProviderQuote | null>;
}