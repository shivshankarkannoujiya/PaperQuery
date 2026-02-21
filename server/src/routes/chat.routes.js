import { Router } from "express";
import { chatWithDocument } from "../controllers/chat.controller.js";


const router = Router();

router.route("/").get(chatWithDocument)

export default router