import { ArrowRightLeft } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <ArrowRightLeft className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">SendRates</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="/about" className="hover:text-foreground transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}