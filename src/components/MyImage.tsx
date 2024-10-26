"use client";

import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";

type LoaderProps = {
  src: string;
  quality?: number | undefined;
  aiCrop?: boolean;
  height?: number;
  width: number;
};

const imageKitLoader = ({
  src,
  width,
  height,
  quality,
  aiCrop,
}: LoaderProps) => {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (height && aiCrop) {
    params.push(`h-${height}`);
  }
  if (quality) {
    params.push(`q-${quality}`);
  }
  if (aiCrop) {
    params.push("fo-auto");
  }

  const paramString = params.join(",");

  // Change var to const
  let urlEndpoint = process.env.NEXT_PUBLIC_IK_ENDPOINT as string;
  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);

  return `${urlEndpoint}/${src}?tr=${paramString}`;
};

type MyImageProps = ImageProps & {
  aiCrop?: boolean;
  height?: number;
  width: number;
};

const MyImage = ({
  width,
  height,
  aiCrop,
  alt = "",
  ...props
}: MyImageProps) => {
  // Added default alt prop
  return (
    <motion.div
      whileHover={{ scale: 1.1 }} // Scale up on hover
      whileTap={{ scale: 0.95 }} // Scale down slightly on click
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Image
        loader={(args) =>
          imageKitLoader({
            ...args,
            width,
            height,
            aiCrop,
          })
        }
        width={width}
        height={height}
        alt={alt} // Ensure alt prop is passed
        {...props}
      />
    </motion.div>
  );
};

export default MyImage;
