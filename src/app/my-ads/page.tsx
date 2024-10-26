"use server";

import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Types } from "mongoose";

// Define the ad document type
type Location = {
  lat: number;
  lng: number;
  address: string;
};

type UploadResponse = {
  // Ensure this structure matches the response from ImageKit
  url: string;
  name: string;
  fileId: string; // Added required fields based on the error
  thumbnailUrl?: string; // Optional fields
  height?: number;
  width?: number;
  // Add any other required properties from the UploadResponse type here
};

type AdDocument = {
  _id: Types.ObjectId;
  title: string;
  price: number;
  description: string;
  category: string;
  contact: string;
  userEmail: string;
  location: Location;
  files: UploadResponse[]; // Ensure this matches what your Ad model expects
  createdAt: Date;
  updatedAt: Date;
};

// Define the converted document type
type ConvertedAd = Omit<AdDocument, "_id"> & {
  _id: string;
  files: UploadResponse[]; // Make sure this matches the expected type
};

// Function to convert ObjectId to string
const convertObjectIdsToStrings = (input: unknown): unknown => {
  if (input === null || input === undefined) {
    return input;
  }

  if (input instanceof Types.ObjectId) {
    return input.toString();
  }

  if (Array.isArray(input)) {
    return input.map((item) => convertObjectIdsToStrings(item));
  }

  if (typeof input === "object" && input !== null) {
    const entries = Object.entries(input);
    return Object.fromEntries(
      entries.map(([key, value]) => [key, convertObjectIdsToStrings(value)])
    );
  }

  return input;
};

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return "No Email Found";
  }

  await connect();
  const rawAds = await AdModel.find({ userEmail: email }).lean<AdDocument[]>();

  // Convert the Mongoose documents to plain objects
  const ads = rawAds.map((ad) =>
    convertObjectIdsToStrings(ad)
  ) as ConvertedAd[];

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {ads.map((ad) => (
          <AdItem key={ad._id} ad={ad} /> // Ensure AdItem component is compatible with ConvertedAd type
        ))}
      </div>
    </div>
  );
}
