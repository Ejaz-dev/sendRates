import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SendRates — Compare Money Transfer Rates",
  description:
    "Find the best exchange rate across Wise, Remitly, Western Union, MoneyGram, and PayPal. See fees, rates, and delivery times side by side.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}