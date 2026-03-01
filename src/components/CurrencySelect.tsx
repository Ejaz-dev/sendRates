"use client";

import { useState, useRef, useEffect } from "react";
import { currencies, Currency } from "@/config/currencies";
import { ChevronDown, Search } from "lucide-react";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = currencies.find((c) => c.code === value);

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="w-full md:w-44" ref={ref}>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full h-12 px-3 rounded-md border bg-background text-sm hover:bg-accent transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{selected?.flag}</span>
          <span className="font-medium">{selected?.code}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-64 max-h-72 rounded-lg border bg-popover shadow-lg overflow-hidden animate-fade-in-up">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Currency list */}
          <div className="overflow-y-auto max-h-56">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No currencies found
              </div>
            )}
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-accent transition-colors ${
                  c.code === value ? "bg-accent font-medium" : ""
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-medium">{c.code}</span>
                <span className="text-muted-foreground">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}