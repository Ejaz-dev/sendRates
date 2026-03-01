import { ArrowRightLeft } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <ArrowRightLeft className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight">SendRates</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Compare exchange rates across major money transfer services.
              Find the best deal every time you send money abroad.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Providers</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="https://wise.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Wise</a>
                <a href="https://remitly.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Remitly</a>
                <a href="https://westernunion.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Western Union</a>
                <a href="https://moneygram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MoneyGram</a>
                <a href="https://paypal.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">PayPal</a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="/about" className="hover:text-foreground transition-colors">About</a>
                <a href="/how-it-works" className="hover:text-foreground transition-colors">How it works</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SendRates. All rights reserved.</p>
          <p className="mt-1">
            Rates are indicative and sourced from third-party providers. SendRates is not a money transfer service.
          </p>
        </div>
      </div>
    </footer>
  );
}