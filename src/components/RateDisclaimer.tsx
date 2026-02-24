interface RateDisclaimerProps {
  lastUpdated: string | null;
}

export default function RateDisclaimer({ lastUpdated }: RateDisclaimerProps) {
  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="text-xs text-muted-foreground text-center mt-6 space-y-1">
      {formatted && <p>Rates last updated: {formatted}</p>}
      <p>
        Rates shown are indicative and may vary at the time of transfer. Always
        confirm the final amount on the provider&apos;s website before sending money.
      </p>
    </div>
  );
}