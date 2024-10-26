import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";

// Adjust the Ad type here to match the structure returned by your model
type Ad = {
  _id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  contact: string;
  files: {
    fileId: string;
    // Ensure these properties exist in the UploadResponse
    name: string;
    url: string;
    thumbnailUrl: string;
    height: number;
    width: number;
    // Include any additional properties you expect
  }[];
  location: {
    lat: number;
    lng: number;
  };
  userEmail: string;
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
  const rawAds = await AdModel.find({ userEmail: email }).lean();

  // You may want to cast rawAds to Ad[] if necessary
  const ads: Ad[] = rawAds.map((ad) => ({
    _id: ad._id,
    title: ad.title,
    price: ad.price,
    category: ad.category,
    description: ad.description,
    contact: ad.contact,
    files: ad.files.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: file.url,
      thumbnailUrl: file.thumbnailUrl,
      height: file.height,
      width: file.width,
      // Any other properties you may want to include
    })),
    location: ad.location,
    userEmail: ad.userEmail,
    createdAt: ad.createdAt,
    updatedAt: ad.updatedAt,
  }));

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
