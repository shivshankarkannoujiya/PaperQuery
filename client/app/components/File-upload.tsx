"use client";
import React from "react";
import Upload from "../icons/Upload";

const FileUploadComponent: React.FC = () => {
  const handleFileUploadButtonClick = () => {
    const elem = document.createElement("input");
    elem.setAttribute("type", "file");
    elem.setAttribute("accept", "application/pdf");
    elem.addEventListener("change", (e) => {
      if (elem.files && elem.files.length > 0) {
        const files = elem.files.item(0);
      } 
    });
    elem.click();
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border border-white">
      <div
        onClick={handleFileUploadButtonClick}
        className="flex justify-center items-center flex-col gap-3"
      >
        <Upload size={35} />
        <p>Upload PDF File</p>
      </div>
    </div>
  );
};

export default FileUploadComponent;
