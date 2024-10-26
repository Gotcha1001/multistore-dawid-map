import { UploadResponse } from "imagekit/dist/libs/interfaces";
import MyImage from "./MyImage";

type Props = {
  file: UploadResponse;
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
          alt="Uploaded thumbnail" // Use one alt prop
          src={file.filePath}
          aiCrop={true}
          className="object-contain"
        />
      </a>
    );
  }

  return <div>{file.url} &raquo;</div>;
}
