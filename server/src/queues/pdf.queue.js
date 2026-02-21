import { Queue } from "bullmq";
import valkey from "../config/valkey.config.js";

export const pdfQueue = new Queue("pdf-processing", {
    connection: valkey
});