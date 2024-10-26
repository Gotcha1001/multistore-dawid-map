import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";

type Location = {
  lat: number;
  lng: number;
  address?: string; // Make address optional
};

type UploadResponse = {
  url: string;
  name: string;
};

type AdDocument = {
  _id: string; // Assume _id is a string since using lean()
  title: string;
  price: number;
  description: string;
  category: string;
  contact: string;
  userEmail: string;
  location: Location; // Ensure the shape matches what you expect
  files: UploadResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return "No Email Found";
  }

  await connect();

  // Fetch ads from the database
  const rawAds = await AdModel.find({ userEmail: email }).lean();

  // Map the raw ads to AdDocument type, and convert ObjectId if necessary
  const ads: AdDocument[] = rawAds.map((ad) => ({
    ...ad,
    _id: ad._id.toString(), // Convert ObjectId to string
    location: {
      lat: ad.location.lat,
      lng: ad.location.lng,
      address: ad.location.address || "Default Address", // Provide a default address if missing
    },
  }));

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {ads.length > 0 ? (
          ads.map((ad) => <AdItem key={ad._id} ad={ad} />)
        ) : (
          <p>No ads available.</p>
        )}
      </div>
    </div>
  );
}
