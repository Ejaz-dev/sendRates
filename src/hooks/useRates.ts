"use client";

import { useState, useCallback } from "react";
import { ProviderQuote } from "@/lib/types";

interface UseRatesResult {
  quotes: ProviderQuote[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  fetchRates: (source: string, target: string, amount: number) => Promise<void>;
}

export function useRates(): UseRatesResult {
  const [quotes, setQuotes] = useState<ProviderQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = useCallback(
    async (source: string, target: string, amount: number) => {
      setIsLoading(true);
      setError(null);

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

  return { quotes, isLoading, error, lastUpdated, fetchRates };
}