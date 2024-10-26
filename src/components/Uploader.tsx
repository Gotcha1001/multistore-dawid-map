// Uploader.tsx
"use client";
import { IKContext, IKUpload } from "imagekitio-react"; // Ensure IKUploadProps is imported
import { IKUploadProps } from "imagekitio-react/dist/types/components/IKUpload/props";

export default function Uploader(props: IKUploadProps) {
  // Use explicit type for props
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
        <IKUpload {...props} /> {/* Spread the props to IKUpload */}
      </IKContext>
    </>
  );
}
