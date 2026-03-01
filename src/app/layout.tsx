import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SendRates — Compare Money Transfer Rates",
  description:
    "Find the best exchange rate across Wise, Remitly, Western Union, MoneyGram, and PayPal. Compare fees, rates, and delivery times side by side.",
  keywords: [
    "money transfer",
    "exchange rate comparison",
    "send money abroad",
    "remittance",
    "Wise",
    "Remitly",
    "Western Union",
    "MoneyGram",
    "PayPal",
    "best exchange rate",
    "transfer fees",
  ],
  openGraph: {
    title: "SendRates — Compare Money Transfer Rates",
    description:
      "Find the best exchange rate across major money transfer services. Compare fees, rates, and delivery times.",
    url: "https://sendrates.vercel.app",
    siteName: "SendRates",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendRates — Compare Money Transfer Rates",
    description:
      "Find the best exchange rate across major money transfer services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}