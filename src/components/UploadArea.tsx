import { faAdd, faImage } from "@fortawesome/free-solid-svg-icons";
import Uploader from "./Uploader";
import { Dispatch, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadThumbnail from "./UploadThumbnail";

// Define the UploadedFile type here
export type UploadedFile = {
  fileId: string;
  url: string;
  fileType?: string; // Add optional properties as needed
  name?: string;
  thumbnailUrl?: string;
  height?: number;
  width?: number;
  filePath?: string;
};

type Props = {
  files: UploadedFile[];
  setFiles: Dispatch<SetStateAction<UploadedFile[]>>;
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
            onSuccess={(file: UploadedFile) => {
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
            <div key={file.fileId} className="size-16 rounded overflow-hidden">
              <UploadThumbnail file={file} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
