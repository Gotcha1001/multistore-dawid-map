"use client";
import { Ad } from "@/models/Ad";
import Link from "next/link";
import UploadThumbnail from "./UploadThumbnail";
import { motion } from "framer-motion";

export default function AdItem({ ad }: { ad: Ad }) {
  return (
    <div className="min-h-24 flex flex-col justify-start" key={ad.id}>
      {ad.files?.length > 0 && (
        <div className="rounded-lg overflow-hidden relative">
          <motion.div
            whileHover={{ scale: 1.1 }} // Scale up on hover
            whileTap={{ scale: 0.95 }} // Scale down slightly on click
            transition={{ type: "spring", stiffness: 300 }}
          >
            <UploadThumbnail onClick={() => {}} file={ad.files[0]} />
            <Link href={`/ad/${ad._id}`} className="absolute inset-0" />
          </motion.div>
        </div>
      )}
      <div>
        <p className="mt-1 font-bold text-white">R {ad.price}</p>
        <Link className="text-gray-400" href={`/ad/${ad._id}`}>
          {ad.title}
        </Link>
      </div>
    </div>
  );
}
