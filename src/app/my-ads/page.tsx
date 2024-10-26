import { getServerSession } from "next-auth";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import AdItem from "@/components/AdItem";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return "No Email Found";
  }

  await connect();
  const adsDocs = await AdModel.find({ userEmail: email });

  // Convert each ad document to a plain object
  const ads = adsDocs.map((ad) => ({
    _id: ad._id.toString(), // Convert ObjectId to string
    title: ad.title,
    price: ad.price,
    description: ad.description,
    contact: ad.contact,
    files: ad.files,
    location: ad.location,
    userEmail: ad.userEmail,
    createdAt: ad.createdAt,
    updatedAt: ad.updatedAt,
    __v: ad.__v,
    category: ad.category,
  }));

  return (
    <div className="container my-6 gradient-background2 rounded-lg mx-auto">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">My Ads</h1>
      {/* Responsive grid: 2 columns on mobile, 4 columns on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {ads.map((ad) => (
          <AdItem key={ad._id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
