"use client";

import ConversionWidget from "@/components/ConversionWidget";
import ComparisonTable from "@/components/ComparisonTable";
import RateDisclaimer from "@/components/RateDisclaimer";
import { useRates } from "@/hooks/useRates";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";

export default function Home() {
  const { quotes, isLoading, error, lastUpdated, fetchRates } = useRates();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Find the best exchange rate
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compare real-time rates from Wise, Remitly, Western Union,
            MoneyGram, and PayPal — see exactly what your recipient gets.
          </p>

          {/* Conversion Widget */}
          <div className="max-w-4xl mx-auto bg-background rounded-xl border shadow-sm p-6">
            <ConversionWidget onSubmit={fetchRates} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again or adjust your search.
            </p>
          </div>
        )}

        {!isLoading && !error && quotes.length > 0 && (
          <>
            <ComparisonTable quotes={quotes} />
            <RateDisclaimer lastUpdated={lastUpdated} />
          </>
        )}

        {!isLoading && !error && quotes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">
              Enter an amount and select currencies to compare rates.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}