import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
          About SendRates
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Making international money transfers transparent and fair.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Why we built this</h2>
            <p className="text-muted-foreground">
              Sending money abroad shouldn&apos;t feel like a guessing game. Most
              people pick the first provider they find without realizing they could
              save significantly by comparing options. Hidden fees, inflated exchange
              rate margins, and confusing pricing make it hard to know what you&apos;re
              actually paying.
            </p>
            <p className="text-muted-foreground mt-3">
              SendRates exists to fix that. We pull exchange rates and fee data from
              major transfer providers and display them side by side so you can
              instantly see who gives you the best deal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How we compare rates</h2>
            <p className="text-muted-foreground">
              For each provider, we show two key costs that eat into your transfer:
              the exchange rate margin (how far the provider&apos;s rate is from the
              true mid-market rate) and the flat transfer fee. Together, these
              determine how much your recipient actually receives.
            </p>
            <p className="text-muted-foreground mt-3">
              We refresh our data every 30 minutes to keep rates as current as
              possible. However, rates can fluctuate between refreshes, so always
              confirm the final amount on the provider&apos;s site before sending.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Providers we compare</h2>
            <p className="text-muted-foreground">
              We currently compare rates from Wise, Remitly, Western Union,
              MoneyGram, and PayPal. These are among the largest and most widely
              used money transfer services globally, covering hundreds of currency
              corridors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Our commitment</h2>
            <p className="text-muted-foreground">
              SendRates is free to use and always will be. We are not affiliated
              with any transfer provider, and our comparisons are unbiased. We
              don&apos;t process transfers — we simply help you make an informed
              choice.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}