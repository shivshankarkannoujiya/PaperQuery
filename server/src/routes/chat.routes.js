import { Router } from "express";
import { chatWithDocument } from "../controllers/chat.controller.js";


const router = Router();

router.route("/").post(chatWithDocument)

export default router