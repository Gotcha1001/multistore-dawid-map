import { IKContext, IKUpload } from "imagekitio-react";

// Use Record<string, any> for general props if specific type is unknown
export default function Uploader(props: Record<string, any>) {
  return (
    <>
      <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IK_ENDPOINT}
        publicKey={process.env.NEXT_PUBLIC_IK_PUBLIC_KEY}
        authenticator={async () => {
          const response = await fetch("/api/imagekit/auth");
          return await response.json();
        }}
      >
        <IKUpload {...props} />
      </IKContext>
    </>
  );
}
