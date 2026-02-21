import { Worker } from "bullmq";
import valkey from "../config/valkey.config.js";

const pdfWorker = new Worker(
    "pdf-processing",
    async (job) => {
        console.log("Processing job:", job.id);
        // const { fileUrl, filename } = job.data;
        console.log(job.data)
    },
    {
        concurrency: 100,
        connection: valkey
    }
);

pdfWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
pdfWorker.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed:`, err),
);

export default pdfWorker