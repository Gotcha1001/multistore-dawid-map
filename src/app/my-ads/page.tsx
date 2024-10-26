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
  // Define the structure based on your use case
  url: string;
  name: string;
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
  files: UploadResponse[];
  createdAt: Date;
  updatedAt: Date;
};

// Define the converted document type
type ConvertedAd = Omit<AdDocument, "_id"> & {
  _id: string;
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
          <AdItem key={ad._id} ad={ad} /> // ad is now a plain object
        ))}
      </div>
    </div>
  );
}
