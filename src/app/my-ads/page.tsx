import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Types } from "mongoose";

// Define a union type for the input to the helper function
type Convertible =
  | Types.ObjectId
  | string
  | number
  | boolean
  | null
  | undefined
  | Convertible[]
  | { [key: string]: Convertible };

// Helper function to convert ObjectIds to strings
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
  const rawAds = await AdModel.find({ userEmail: email }).lean();
  const ads = convertObjectIdsToStrings(rawAds);

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {ads?.map((ad) => (
          <AdItem key={ad._id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
