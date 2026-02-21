import path from "path";
import fs from "fs";
import { Worker } from "bullmq";
import valkey from "../config/valkey.config.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ENV } from "../config/env.js";

const pdfWorker = new Worker(
  "pdf-processing",
  async (job) => {
    const data = JSON.parse(job.data);
    /*
        Steps:
            1. path: data.file.path
            2. Read pdf from `path`
            3. Chunk the pdf
            4. call the OpenAIEmbedding model for every chunk
            5. Store the embeddings of chunks into qdrant DB
      */

    const safeRelativePath = data.path.replace(/\\/g, "/");
    const absolutePath = path.join(process.cwd(), safeRelativePath);

    console.log("Reading file:", absolutePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error("PDF file not found");
    }

    //load pdf
    const loader = new PDFLoader(absolutePath);
    const docs = await loader.load({});

    console.log("Pages loaded:", docs.length);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    console.log("SPLITTING...");
    const splitDocs = await splitter.splitDocuments(docs);
    console.log("Chunks created:", splitDocs.length);
    console.log("DONE...");

    const embedder = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: ENV.OPENAI_API_KEY
    });

    console.log("CREATING EMBEDDINGS & STORING INTO QDRANT...");
    const vectorStore = await QdrantVectorStore.fromDocuments(
      splitDocs,
      embedder,
      {
        url: ENV.QDRANT_URL,
        collectionName: "pdf-docs",
      },
    );
    console.log("STORED SUCCESSFULLY");
  },

  {
    concurrency: 100,
    connection: valkey,
  },
);

pdfWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
pdfWorker.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed:`, err),
);

export default pdfWorker;
