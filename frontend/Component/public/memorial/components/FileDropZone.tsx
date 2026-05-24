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
  maxFiles,
}: {
  title: string;
  subtitle: string;
  files: string[];
  onFiles: (fileNames: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}) {
  const [previews, setPreviews] = React.useState<
    Array<{ name: string; url: string }>
  >([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const limitedFiles =
      typeof maxFiles === "number"
        ? selectedFiles.slice(0, maxFiles)
        : selectedFiles;
    const nextFiles = limitedFiles.map((file) => file.name);

    setPreviews([]);
    limitedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setPreviews((current) => [
          ...current,
          {
            name: file.name,
            url: typeof reader.result === "string" ? reader.result : "",
          },
        ]);
      };

      reader.readAsDataURL(file);
    });

    onFiles(nextFiles);
  };

  return (
    <div>
      {title ? <Label>{title}</Label> : null}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#274877] hover:bg-white">
        <Upload className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-3 text-sm text-slate-700">Click to upload photos</p>
        <p className="mt-1 text-[0.72rem] text-slate-400">{subtitle}</p>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="mt-4 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
        />
      </div>
      {previews.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((file) => (
            <div
              key={file.name}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="aspect-square bg-slate-100">
                {file.url ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <p className="truncate px-2 py-2 text-[0.72rem] text-slate-600">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      ) : files.length > 0 ? (
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
      {typeof maxFiles === "number" ? (
        <p className="mt-2 text-xs text-slate-400">
          Maximum {maxFiles} file{maxFiles === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}
