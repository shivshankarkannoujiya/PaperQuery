import { askToRag } from "../services/rag.service.js";

export const chatWithDocument = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
          return res.status(400).json({ error: "Message is required" });
        }

        const result = await askToRag(question)

        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({ error: "Failed to chat with document" });
    }    
}

