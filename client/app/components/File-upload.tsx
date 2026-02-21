"use client";
import React, { useState } from "react";
import Upload from "../icons/Upload";

const FileUploadComponent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file); 

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ingest`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed. Please try again.");
      }

      const data = await response.json();
      console.log(data)
      console.log(data.url)
      setUploadedUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadButtonClick = () => {
    const elem = document.createElement("input");
    elem.setAttribute("type", "file");
    elem.setAttribute("accept", "application/pdf");
    elem.addEventListener("change", () => {
      if (elem.files && elem.files.length > 0) {
        const file = elem.files.item(0);
        if (file) uploadFile(file);
      }
    });
    elem.click();
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex flex-col justify-center items-center p-4 rounded-lg border border-white gap-3">
      <div
        onClick={!uploading ? handleFileUploadButtonClick : undefined}
        className={`flex justify-center items-center flex-col gap-3 
          ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <Upload size={35} />
        <p>{uploading ? "Uploading..." : "Upload PDF File"}</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {uploadedUrl && (
        <a
          href={uploadedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm underline"
        >
          View uploaded PDF
        </a>
      )}
    </div>
  );
};

export default FileUploadComponent;
