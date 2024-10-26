import { faAdd, faImage } from "@fortawesome/free-solid-svg-icons";
import Uploader from "./Uploader";

import { Dispatch, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadThumbnail from "./UploadThumbnail";
import { UploadResponse as IKUploadResponse } from "imagekit-javascript/dist/src/interfaces/UploadResponse"; // Use this import
// ... other imports remain the same

// Update the Props type
type Props = {
  files: IKUploadResponse[]; // Change to the imported UploadResponse type
  setFiles: Dispatch<SetStateAction<IKUploadResponse[]>>; // Same here
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
            "upload-btn  mt-3 border px-4 py-2 rounded-lg inline-flex gap-1 items-center justify-center" +
            (isUploading
              ? "text-gray-400 cursor-not-allowed"
              : "  border-blue-500 text-blue-600 cursor-pointer")
          }
        >
          <Uploader
            onUploadStart={() => setIsUploading(true)}
            onSuccess={(file: IKUploadResponse) => {
              // Change here
              setFiles((prev) => [...prev, file]);
              setIsUploading(false);
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
