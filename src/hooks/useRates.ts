"use client";

import { useState, useCallback } from "react";
import { ProviderQuote } from "@/lib/types";

interface LastRequest {
  source: string;
  target: string;
  amount: number;
}

interface UseRatesResult {
  quotes: ProviderQuote[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  lastRequest: LastRequest | null;
  fetchRates: (source: string, target: string, amount: number) => Promise<void>;
}

export function useRates(): UseRatesResult {
  const [quotes, setQuotes] = useState<ProviderQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<LastRequest | null>(null);

  const fetchRates = useCallback(
    async (source: string, target: string, amount: number) => {
      setIsLoading(true);
      setError(null);
      setLastRequest({ source, target, amount });

      try {
        const res = await fetch(
          `/api/rates?source=${source}&target=${target}&amount=${amount}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch rates");
        }

        setQuotes(data.quotes);
        setLastUpdated(
          data.quotes[0]?.fetchedAt || new Date().toISOString()
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { quotes, isLoading, error, lastUpdated, lastRequest, fetchRates };
}