import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "public")));

import ingestionRouter from "./routes/ingesion.routes.js";
app.use("/api/v1/ingest", ingestionRouter);

export default app;
