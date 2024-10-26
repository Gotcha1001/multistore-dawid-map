import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";

type Location = {
  lat: number;
  lng: number;
  address: string;
};

type UploadResponse = {
  url: string;
  name: string;
};

type AdDocument = {
  _id: string; // Changed to string
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

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return "No Email Found";
  }

  await connect();
  const rawAds: AdDocument[] = await AdModel.find({ userEmail: email }).lean();

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {rawAds.length > 0 ? (
          rawAds.map((ad) => <AdItem key={ad._id} ad={ad} />) // No need for toString() since _id is a string now
        ) : (
          <p>No ads available.</p>
        )}
      </div>
    </div>
  );
}
