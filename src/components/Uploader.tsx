import { IKContext, IKUpload } from "imagekitio-react";

// Define specific types for the ImageKit response
interface IKUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  fileType: string;
  tags?: string[];
  AITags?: string[];
  versionInfo?: {
    id: string;
    name: string;
  };
  metadata?: Record<string, unknown>;
}

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
  onSuccess?: (response: IKUploadResponse) => void;
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
