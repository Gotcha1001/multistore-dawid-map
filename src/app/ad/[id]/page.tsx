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
import { UploadResponse } from "imagekit/dist/libs/interfaces";

// Define location type
type Location = {
  lat: number;
  lng: number;
  address: string;
};

// Define the ad document type
type AdDocument = {
  _id: Types.ObjectId;
  title: string;
  price: number;
  description: string;
  category: string;
  contact: string;
  userEmail: string;
  location: Location;
  files: UploadResponse[];
  createdAt: Date;
  updatedAt: Date;
};

// Define the converted document type
type ConvertedAd = Omit<AdDocument, "_id"> & {
  _id: string;
};

// Define base convertible types
type ConvertiblePrimitive =
  | Types.ObjectId
  | string
  | number
  | boolean
  | null
  | undefined
  | Date;

// Define recursive convertible type
type Convertible =
  | ConvertiblePrimitive
  | Location
  | UploadResponse
  | Convertible[]
  | { [key: string]: Convertible };

const convertObjectIdsToStrings = (input: Convertible): Convertible => {
  if (input === null || input === undefined) {
    return input;
  }

  if (input instanceof Types.ObjectId) {
    return input.toString();
  }

  if (input instanceof Date) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => convertObjectIdsToStrings(item));
  }

  if (typeof input === "object") {
    const entries = Object.entries(input) as [string, Convertible][];
    return Object.fromEntries(
      entries.map(([key, value]) => [key, convertObjectIdsToStrings(value)])
    );
  }

  return input;
};

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  await connect();
  const rawAd = (await AdModel.findById(
    args.params.id
  ).lean()) as AdDocument | null;
  const session = await getServerSession(authOptions);

  if (!rawAd) {
    return <div>Not Found</div>; // Return JSX, not a string
  }

  const ad = convertObjectIdsToStrings(rawAd) as ConvertedAd;

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

        {session && session?.user?.email === ad.userEmail && (
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
