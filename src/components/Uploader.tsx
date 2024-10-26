"use client";
import { IKContext, IKUpload } from "imagekitio-react";

export default function Uploader(IKUploadProps) {
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
        <IKUpload {...IKUploadProps} />
      </IKContext>
    </>
  );
}
