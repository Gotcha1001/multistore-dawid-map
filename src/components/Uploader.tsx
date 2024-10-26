import { IKContext, IKUpload } from "imagekitio-react";

// Extend IKUploadProps if you need additional custom props
type UploaderProps = IKUploadProps;

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
