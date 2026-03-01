"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConversionWidget from "@/components/ConversionWidget";
import ComparisonTable from "@/components/ComparisonTable";
import ShareButton from "@/components/ShareButton";
import RateDisclaimer from "@/components/RateDisclaimer";
import { useRates } from "@/hooks/useRates";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function HomeContent() {
  const { quotes, isLoading, error, lastUpdated, fetchRates, lastRequest } = useRates();
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("source");
    const target = searchParams.get("target");
    const amount = searchParams.get("amount");

    if (source && target && amount) {
      fetchRates(source.toUpperCase(), target.toUpperCase(), parseFloat(amount));
    }
  }, [searchParams, fetchRates]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="border-b bg-muted/30 hero-gradient">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Find the best exchange rate
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compare real-time rates from Wise, Remitly, Western Union,
            MoneyGram, and PayPal — see exactly what your recipient gets.
          </p>

          <div className="max-w-4xl mx-auto bg-background rounded-xl border shadow-sm p-6 card-glow">
            <ConversionWidget onSubmit={fetchRates} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-16 w-full rounded-lg bg-muted/50 shimmer-loading animate-fade-in-up-delay-${i}`}
              />
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
            <div className="flex items-center justify-between mb-4 animate-fade-in-up">
              <h2 className="text-lg font-semibold">
                Comparing {lastRequest?.source} → {lastRequest?.target}
              </h2>
              {lastRequest && (
                <ShareButton
                  source={lastRequest.source}
                  target={lastRequest.target}
                  amount={lastRequest.amount}
                />
              )}
            </div>
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

      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}