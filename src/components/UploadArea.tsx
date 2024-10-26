// UploadArea.tsx
import { faAdd, faImage } from "@fortawesome/free-solid-svg-icons";
import Uploader from "./Uploader";
import { Dispatch, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadThumbnail from "./UploadThumbnail";
// Ensure you're importing UploadResponse from the correct package
import { UploadResponse } from "imagekitio-react/dist/types/interfaces"; // Change this line

type Props = {
  files: UploadResponse[];
  setFiles: Dispatch<SetStateAction<UploadResponse[]>>;
};

export default function UploadArea({ files, setFiles }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-center text-gray-400 uppercase text-xs font-bold">
        Add Photos of your Product:
      </h2>
      <div className="flex flex-col">
        <FontAwesomeIcon icon={faImage} className="h-24 text-gray-300" />
        <label
          className={
            "upload-btn mt-3 border px-4 py-2 rounded-lg inline-flex gap-1 items-center justify-center" +
            (isUploading
              ? " text-gray-400 cursor-not-allowed"
              : " border-blue-500 text-blue-600 cursor-pointer")
          }
        >
          <Uploader
            onUploadStart={() => setIsUploading(true)}
            onSuccess={(file: UploadResponse) => {
              setFiles((prev) => [...prev, file]); // Add the file to the state
              setIsUploading(false); // Stop the upload process
            }}
          />

          {isUploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faAdd} />
              <span>Add Photos</span>
            </>
          )}
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file) => (
            <div key={file.fileId} className="size-16 rounded overflow-hidden ">
              <UploadThumbnail file={file} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
