import { IKContext, IKUpload } from "imagekitio-react";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

// Define upload progress event type
interface IKUploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

// Define upload start event type
interface IKUploadStartEvent {
  file: File;
  xhr: XMLHttpRequest;
}

interface UploaderProps {
  fileName?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  responseFields?: string[];
  validateFile?: (file: File) => boolean;
  folder?: string;
  isPrivateFile?: boolean;
  customCoordinates?: string;
  extensions?: string[];
  webhookUrl?: string;
  overwriteFile?: boolean;
  overwriteAITags?: boolean;
  overwriteTags?: boolean;
  overwriteCustomMetadata?: boolean;
  transformation?: string;
  customMetadata?: Record<string, unknown>;
  onError?: (err: Error) => void;
  onSuccess?: (response: UploadResponse) => void;
  onUploadStart?: (evt: IKUploadStartEvent) => void;
  onUploadProgress?: (evt: IKUploadProgressEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function Uploader(props: UploaderProps) {
  return (
    <IKContext
      urlEndpoint={process.env.NEXT_PUBLIC_IK_ENDPOINT || ""}
      publicKey={process.env.NEXT_PUBLIC_IK_PUBLIC_KEY || ""}
      authenticator={async () => {
        const response = await fetch("/api/imagekit/auth");
        return await response.json();
      }}
    >
      <IKUpload {...props} />
    </IKContext>
  );
}
