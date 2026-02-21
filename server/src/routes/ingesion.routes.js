import { Router } from "express";
import { ingestPdf } from "../controllers/ingestion.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/pdfs").post(upload.single("pdf"), ingestPdf);

export default router;
