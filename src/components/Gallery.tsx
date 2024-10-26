"use client";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import UploadView from "./UploadView";
import UploadThumbnail from "./UploadThumbnail";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import MyImage from "./MyImage";

export default function Gallery({ files }: { files: UploadResponse }) {
  const [activeFile, setActiveFile] = useState<UploadResponse | null>(
    files?.[0] || null
  );

  function next() {
    const activeFileIndex = files.findIndex(
      (f) => f.fileId === activeFile?.fileId
    );
    const nextIndex =
      activeFileIndex === files.length - 1 ? 0 : activeFileIndex + 1;
    const nextFile = files[nextIndex];
    setActiveFile(nextFile);
  }
  function prev() {
    const activeFileIndex = files.findIndex(
      (f) => f.fileId === activeFile?.fileId
    );
    const prevIndex =
      activeFileIndex === 0 ? files.length - 1 : activeFileIndex - 1;
    const prevFile = files[prevIndex];
    setActiveFile(prevFile);
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Background blur container */}
      {activeFile && (
        <div className="absolute inset-0 overflow-hidden">
          <MyImage
            src={activeFile.filePath}
            alt="background"
            width={2048}
            height={2048}
            className="object-cover opacity-30 blur w-full h-full"
          />
        </div>
      )}

      {/* Content container with padding to prevent overflow */}
      <div className="relative flex flex-col h-full p-4">
        {/* Main image area */}
        {activeFile && (
          <div className="flex-1 flex items-center justify-center relative min-h-0">
            {/* Fixed size container for image */}
            <div className="relative w-full max-w-3xl aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full p-4">
                  <div className="w-full h-full flex items-center justify-center">
                    <UploadView
                      file={activeFile}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={prev}
                className="pointer-events-auto items-center justify-center flex size-12 rounded-full transition bg-gray-500/40 hover:bg-gray-500/80 transform hover:scale-110 duration-300"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={next}
                className="pointer-events-auto items-center justify-center flex size-12 rounded-full transition bg-gray-500/40 hover:bg-gray-500/80 transform hover:scale-110 duration-300"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        )}

        {/* Thumbnail strip */}
        <div className="mt-4 flex gap-4 justify-center relative z-10 bg-black/20 p-4 rounded-lg">
          {files.map((file) => (
            <div
              key={file.fileId}
              className="size-14 cursor-pointer rounded overflow-hidden"
            >
              <UploadThumbnail
                onClick={() => setActiveFile(file)}
                file={file}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
