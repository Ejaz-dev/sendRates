"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  source: string;
  target: string;
  amount: number;
}

export default function ShareButton({ source, target, amount }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}?source=${source}&target=${target}&amount=${amount}`;
  const shareText = `Compare ${source} to ${target} money transfer rates on SendRates`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "SendRates Comparison",
        text: shareText,
        url: shareUrl,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="gap-1.5"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5" />
            Share comparison
          </>
        )}
      </Button>


      <Button
        variant="outline"
        size="sm"
        onClick={shareNative}
        className="gap-1.5 md:hidden"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </Button>
    </div>
  );
}