import { askToRagStream } from "../services/rag.service.js";

export const chatWithDocument = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const generator = askToRagStream(question);

    for await (const event of generator) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error("Chat Controller Error:", error);

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: "Failed to chat with document" });
    }
  }
};
