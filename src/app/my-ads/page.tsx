import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Types } from "mongoose";

type Location = {
  lat: number;
  lng: number;
  address: string;
};

type UploadResponse = {
  // Define the structure based on your image response
  url: string;
  name: string;
};

type AdDocument = {
  _id: string; // Change this to string if you're using lean()
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

// Define a more specific convertible type
type Convertible =
  | string
  | number
  | boolean
  | null
  | undefined
  | Types.ObjectId
  | Location
  | UploadResponse
  | Convertible[]
  | { [key: string]: Convertible };

const convertObjectIdsToStrings = (obj: Convertible): Convertible => {
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

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return "No Email Found";
  }

  await connect();
  const rawAds: AdDocument[] = await AdModel.find({ userEmail: email }).lean();
  const ads = rawAds.map((ad) => convertObjectIdsToStrings(ad)) as AdDocument[];

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {ads.length > 0 ? (
          ads.map((ad) => <AdItem key={ad._id.toString()} ad={ad} />)
        ) : (
          <p>No ads available.</p>
        )}
      </div>
    </div>
  );
}
