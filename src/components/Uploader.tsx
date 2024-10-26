import { IKContext, IKUpload } from "imagekitio-react";

interface UploaderProps {
  fileName?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  responseFields?: string[];
  validateFile?: (file: File) => boolean;
  folder?: string;
  isPrivateFile?: boolean;
  customCoordinates?: string;
  extensions?: unknown[];
  webhookUrl?: string;
  overwriteFile?: boolean;
  overwriteAITags?: boolean;
  overwriteTags?: boolean;
  overwriteCustomMetadata?: boolean;
  transformation?: string;
  customMetadata?: Record<string, unknown>;
  onError?: (err: Error) => void;
  onSuccess?: (response: any) => void;
  onUploadStart?: (evt: any) => void;
  onUploadProgress?: (evt: any) => void;
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
