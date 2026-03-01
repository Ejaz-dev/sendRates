import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRightLeft, Search, BarChart3, Shield } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <ArrowRightLeft className="h-6 w-6" />,
      title: "Enter your transfer details",
      description:
        "Tell us how much you want to send, which currency you're sending from, and which currency your recipient needs.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "We compare the top providers",
      description:
        "SendRates checks exchange rates and fees across Wise, Remitly, Western Union, MoneyGram, and PayPal in real time.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "See a clear comparison",
      description:
        "View each provider's exchange rate, transfer fee, rate margin, total amount your recipient gets, and estimated delivery time — all in one table.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Choose the best option",
      description:
        "Sort by best value, lowest fee, best rate, or fastest delivery. Then go directly to the provider's website to complete your transfer.",
    },
  ];

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
          How SendRates Works
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          We help you find the cheapest way to send money internationally.
          No sign-up required — just compare and go.
        </p>

        <div className="space-y-10">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {step.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {index + 1}. {step.title}
                </h2>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg border bg-muted/30 p-6">
          <h3 className="font-semibold mb-2">Things to know</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Rates shown on SendRates are indicative and refreshed every 30
              minutes. The actual rate you receive may differ slightly at the
              time of your transfer.
            </p>
            <p>
              SendRates is a comparison tool — we do not process transfers
              ourselves. You will always complete your transfer directly on
              the provider&apos;s website.
            </p>
            <p>
              Transfer fees and exchange rate margins vary based on the amount
              you send, the currency corridor, and the payment method you use.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}