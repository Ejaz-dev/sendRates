"use client";

import { useState } from "react";
import { ProviderQuote } from "@/lib/types";
import { providerMeta } from "@/config/providers";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Clock, TrendingUp, DollarSign } from "lucide-react";

type SortKey = "bestValue" | "lowestFee" | "fastestDelivery" | "bestRate";

interface ComparisonTableProps {
  quotes: ProviderQuote[];
}

export default function ComparisonTable({ quotes }: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("bestValue");

  const sorted = [...quotes].sort((a, b) => {
    switch (sortKey) {
      case "bestValue":
        return b.totalReceived - a.totalReceived;
      case "lowestFee":
        return a.flatFee - b.flatFee;
      case "fastestDelivery":
        return (a.deliveryMinutes ?? 9999) - (b.deliveryMinutes ?? 9999);
      case "bestRate":
        return b.exchangeRate - a.exchangeRate;
      default:
        return 0;
    }
  });

  const bestValue = sorted[0];

  const sortOptions: { key: SortKey; label: string; icon: React.ReactNode }[] = [
    { key: "bestValue", label: "Best value", icon: <TrendingUp className="h-3 w-3" /> },
    { key: "bestRate", label: "Best rate", icon: <ArrowUpDown className="h-3 w-3" /> },
    { key: "lowestFee", label: "Lowest fee", icon: <DollarSign className="h-3 w-3" /> },
    { key: "fastestDelivery", label: "Fastest", icon: <Clock className="h-3 w-3" /> },
  ];

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-muted-foreground self-center mr-1">Sort by:</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              sortKey === opt.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Provider</TableHead>
              <TableHead>Exchange Rate</TableHead>
              <TableHead>Rate Margin</TableHead>
              <TableHead>Transfer Fee</TableHead>
              <TableHead>Recipient Gets</TableHead>
              <TableHead>Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((quote) => {
              const meta = providerMeta[quote.providerSlug];
              const isBest = quote === bestValue;

              return (
                <TableRow
                  key={quote.providerSlug}
                  className={isBest ? "bg-green-50 dark:bg-blue-950/30 table-row-best" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={quote.logoUrl}
                        alt={quote.providerName}
                        className="w-6 h-6 rounded"
                      />
                      {quote.providerName}
                      {isBest && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-blue-900/50 dark:text-blue-300">
                          Best
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {quote.exchangeRate.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        quote.marginPercent < 0.5
                          ? "text-green-600"
                          : quote.marginPercent < 1.5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {quote.marginPercent.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {quote.flatFee === 0
                      ? "Free"
                      : `${quote.sourceCurrency} ${quote.flatFee.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="font-semibold text-lg">
                    {quote.targetCurrency}{" "}
                    {quote.totalReceived.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {quote.deliveryTime}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {sorted.map((quote) => {
          const meta = providerMeta[quote.providerSlug];
          const isBest = quote === bestValue;

          return (
            <div
              key={quote.providerSlug}
              className={`rounded-lg border p-4 ${
                isBest ? "border-green-300 bg-green-50 dark:border-blue-800/50 dark:bg-blue-950/30" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={quote.logoUrl}
                    alt={quote.providerName}
                    className="w-6 h-6 rounded"
                  />
                  <span className="font-medium">{quote.providerName}</span>
                  {isBest && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Best
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {quote.deliveryTime}
                </span>
              </div>

              <div className="text-2xl font-bold mb-2">
                {quote.targetCurrency}{" "}
                {quote.totalReceived.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div>
                  <div className="text-xs uppercase tracking-wider">Rate</div>
                  <div className="font-mono">{quote.exchangeRate.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider">Margin</div>
                  <div>{quote.marginPercent.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider">Fee</div>
                  <div>
                    {quote.flatFee === 0
                      ? "Free"
                      : `${quote.sourceCurrency} ${quote.flatFee.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}