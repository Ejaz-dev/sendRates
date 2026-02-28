import { Queue } from "bullmq";
import redis from "./redis";

export const rateQueue = new Queue("rate-refresh", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});