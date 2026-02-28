import { Worker, Job } from "bullmq";
import redis from "./redis";
import { getAllQuotes } from "./providers";
import { setCachedRates, setLastRefreshTime } from "./cache";

const POPULAR_CORRIDORS = [
  { source: "USD", target: "EUR", amounts: [100, 500, 1000, 5000] },
  { source: "USD", target: "GBP", amounts: [100, 500, 1000, 5000] },
  { source: "USD", target: "INR", amounts: [100, 500, 1000, 5000] },
  { source: "USD", target: "PHP", amounts: [100, 500, 1000, 5000] },
  { source: "USD", target: "MXN", amounts: [100, 500, 1000, 5000] },
  { source: "GBP", target: "EUR", amounts: [100, 500, 1000, 5000] },
  { source: "CAD", target: "INR", amounts: [100, 500, 1000, 5000] },
];

const worker = new Worker(
  "rate-refresh",
  async (job: Job) => {
    console.log(`[Worker] Starting rate refresh job ${job.id}`);

    for (const corridor of POPULAR_CORRIDORS) {
      for (const amount of corridor.amounts) {
        try {
          const quotes = await getAllQuotes({
            sourceCurrency: corridor.source,
            targetCurrency: corridor.target,
            sourceAmount: amount,
          });

          await setCachedRates(
            { source: corridor.source, target: corridor.target, amount },
            quotes
          );

          console.log(
            `[Worker] Cached ${corridor.source} → ${corridor.target} $${amount}: ${quotes.length} quotes`
          );
        } catch (error) {
          console.error(
            `[Worker] Failed ${corridor.source} → ${corridor.target} $${amount}:`,
            error
          );
        }

        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    await setLastRefreshTime();
    console.log("[Worker] Refresh complete");
  },
  { connection: redis }
);

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err);
});

export default worker;