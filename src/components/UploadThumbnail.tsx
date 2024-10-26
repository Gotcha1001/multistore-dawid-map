import { UploadedFile } from "./UploadArea"; // Adjust import as necessary
import MyImage from "./MyImage";

type Props = {
  file: UploadedFile;
  onClick?: () => void;
};

export default function UploadThumbnail({ file, onClick }: Props) {
  function handleClick(ev: React.MouseEvent) {
    if (onClick) {
      ev.preventDefault();
      return onClick();
    }
    location.href = file.url;
  }

  if (file.fileType === "image") {
    return (
      <a onClick={handleClick} target="_blank">
        <MyImage
          width={300}
          height={300}
          alt="Uploaded thumbnail"
          src={file.filePath || file.url} // Ensure there's a fallback if filePath is undefined
          aiCrop={true}
          className="object-contain"
        />
      </a>
    );
  }

  return <div>{file.url} &raquo;</div>;
}
