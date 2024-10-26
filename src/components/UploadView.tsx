import { UploadResponse } from "imagekit/dist/libs/interfaces";
import MyImage from "./MyImage";

interface UploadViewProps {
  file: UploadResponse;
  className?: string; // Make className optional
}

export default function UploadView({ file, className }: UploadViewProps) {
  if (file.fileType === "image") {
    return (
      <MyImage
        src={file.filePath}
        alt="product photo"
        width={2048}
        height={2048}
        className={`w-auto h-auto max-w-full max-h-full rounded-lg ${className}`} // Include className here
      />
    );
  }
  return <>{file.name}</>;
}
