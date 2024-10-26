"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import DeleteAdButton from "@/components/DeleteAdButton";
import Gallery from "@/components/Gallery";
import LocationMap from "@/components/LocationMap";
import { connect, formatMoney } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import Link from "next/link";

type FileType = "image" | "video" | "document"; // Adjust this according to your needs

// Define a type for the file object
interface File {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string; // optional
  height?: number; // optional
  width?: number; // optional
  size?: number; // optional
  fileType?: FileType; // optional
  isPrivateFile?: boolean; // optional
}

interface Ad {
  _id: string;
  title: string;
  userEmail: string;
  price: number;
  category: string;
  description: string;
  contact: string;
  location: { lat: number; lng: number }; // Adjust based on your actual location type
  files: File[]; // Use the File type defined above
}

const convertObjectIdsToStrings = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectIdsToStrings);
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertObjectIdsToStrings(value),
      ])
    );
  }

  return obj;
};

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  await connect();
  const rawAd = await AdModel.findById(args.params.id).lean();
  const session = await getServerSession(authOptions);

  if (!rawAd) {
    return "Not Found!!!";
  }

  // Convert ObjectIds and assert the type
  const ad = convertObjectIdsToStrings(rawAd) as Ad;

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 top-28 gap-4 p-4">
      <div className="w-full md:w-3/5 bg-black text-white flex flex-col relative rounded-md min-h-[300px]">
        <Gallery files={ad.files} />
      </div>

      <div
        className="w-full md:w-2/5 p-4 md:p-6 grow-0 bg-gradient-to-r from-black to-blue-500 rounded-lg 
        shadow-lg flex flex-col space-y-4 text-white max-h-[calc(100vh-8rem)] overflow-y-auto"
      >
        <h1 className="text-2xl md:text-4xl font-serif font-bold">
          {ad.title}
        </h1>

        {session && session.user?.email === ad.userEmail && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/edit/${ad._id}`}
              className="border border-blue-600 text-blue-600 rounded-md py-1 px-4 inline-flex gap-2 items-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faPencil} />
              <span>Edit</span>
            </Link>
            <DeleteAdButton id={ad._id} />
          </div>
        )}

        <div className="space-y-1 md:space-y-2">
          <label className="text-sm md:text-base">Price</label>
          <p className="text-xl md:text-2xl font-bold">
            {formatMoney(ad.price)}
          </p>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="font-semibold text-sm md:text-base">
            Category:
          </label>
          <p className="bg-white text-gray-800 capitalize p-2 rounded-md opacity-80">
            {ad.category}
          </p>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="font-semibold text-sm md:text-base">
            Description:
          </label>
          <p className="bg-white text-gray-800 p-2 rounded-md opacity-80 text-sm">
            {ad.description}
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-sm md:text-base">Contact:</label>
          <p className="bg-white text-gray-800 p-2 rounded-md opacity-80">
            {ad.contact}
          </p>

          <label className="text-sm md:text-base">Location</label>
          <LocationMap
            className="w-full h-48 md:h-64 rounded-lg"
            location={ad.location}
          />
        </div>
      </div>
    </div>
  );
}
