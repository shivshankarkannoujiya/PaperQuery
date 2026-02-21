import { pdfQueue } from "../queues/pdf.queue.js";

export const ingestPdf = async (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/static/pdfs/${req.file.filename}`;

  await pdfQueue.add(
    "process-pdf",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
      fileUrl,
    }),
  );

  res.status(200).json({
    message: "Uploaded and queued for processing",
    url: fileUrl,
  });
};
