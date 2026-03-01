"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CurrencySelect from "@/components/CurrencySelect";
import { ArrowRightLeft, Loader2 } from "lucide-react";

interface ConversionWidgetProps {
  onSubmit: (source: string, target: string, amount: number) => void;
  isLoading: boolean;
}

export default function ConversionWidget({
  onSubmit,
  isLoading,
}: ConversionWidgetProps) {
  const [amount, setAmount] = useState("1000");
  const [source, setSource] = useState("USD");
  const [target, setTarget] = useState("EUR");

  const handleSwap = () => {
    setSource(target);
    setTarget(source);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(source, target, numAmount);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        {/* Amount Input */}
        <div className="w-full md:flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            You send
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            max="100000"
            step="0.01"
            className="h-12 text-lg"
          />
        </div>

        {/* Source Currency */}
        <CurrencySelect value={source} onChange={setSource} label="From" />

        {/* Swap Button */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="h-12 w-12 rounded-full mt-5 md:mt-0"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Target Currency */}
        <CurrencySelect value={target} onChange={setTarget} label="To" />

        {/* Submit */}
        <div className="w-full md:w-auto flex items-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full md:w-auto px-8 mt-5 md:mt-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Compare
          </Button>
        </div>
      </div>
    </form>
  );
}