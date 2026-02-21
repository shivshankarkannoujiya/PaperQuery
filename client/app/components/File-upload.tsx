"use client";
import React, { useState } from "react";
import Upload from "../icons/Upload";
import Spinner from "../icons/Spinner";

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
      console.log(data);
      console.log(data.url);
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
    <div className="flex flex-col items-center gap-6 w-full max-w-55">
      <div
        onClick={!uploading ? handleFileUploadButtonClick : undefined}
        className={`
          group relative w-full aspect-square rounded-3xl
          bg-[#131313] border border-[#2a2a2a]
          flex flex-col items-center justify-center gap-4
          transition-all duration-300
          ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-[#c9a96e] hover:bg-[#1a1812]"
          }
        `}
      >
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 40px 0 rgba(201,169,110,0.07)" }}
        />

        <div
          className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          bg-[#1e1c18] border border-[#2a2a2a]
          transition-all duration-300
          ${!uploading && "group-hover:border-[#c9a96e] group-hover:bg-[#252218]"}
        `}
        >
          {uploading ? (
            <Spinner/>
          ) : (
            <span className="text-[#c9a96e] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <Upload size={28} />
            </span>
          )}
        </div>

        <div className="text-center px-4">
          <p
            className="text-[#e8e4dc] text-sm font-medium tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {uploading ? "Uploading…" : "Upload PDF"}
          </p>
          {!uploading && (
            <p className="text-[#555] text-[11px] mt-1 tracking-wider uppercase">
              Click to browse
            </p>
          )}
        </div>

        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#c9a96e] opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-[#c9a96e] opacity-20 group-hover:opacity-50 transition-opacity duration-300" />
      </div>

      {error && (
        <div className="w-full px-3 py-2 rounded-xl bg-[#1f1010] border border-[#5a2020] text-center">
          <p className="text-[#e07070] text-[11px] tracking-wide">{error}</p>
        </div>
      )}

      {uploadedUrl && (
        <div className="w-full px-3 py-2.5 rounded-xl bg-[#121a13] border border-[#2a4a2a] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6ec97a] shrink-0" />
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6ec97a] text-[11px] tracking-wide underline underline-offset-2 truncate"
          >
            View uploaded PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
