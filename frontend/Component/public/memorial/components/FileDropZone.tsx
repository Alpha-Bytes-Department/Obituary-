"use client";

import React from "react";
import { Upload } from "lucide-react";
import Label from "./Label";

export default function FileDropZone({
  title,
  subtitle,
  files,
  onFiles,
  multiple = true,
}: {
  title: string;
  subtitle: string;
  files: string[];
  onFiles: (fileNames: string[]) => void;
  multiple?: boolean;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []).map(
      (file) => file.name,
    );
    onFiles(nextFiles);
  };

  return (
    <div>
      <Label>{title}</Label>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#274877] hover:bg-white">
        <Upload className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-3 text-sm text-slate-700">Click to upload photos</p>
        <p className="mt-1 text-[0.72rem] text-slate-400">{subtitle}</p>
        <input
          type="file"
          multiple={multiple}
          onChange={handleChange}
          className="mt-4 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
        />
      </div>
      {files.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((fileName) => (
            <span
              key={fileName}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
            >
              {fileName}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
