"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DeleteAdButton from "@/components/DeleteAdButton";
import Gallery from "@/components/Gallery";
import LocationMap from "@/components/LocationMap";
import { connect, formatDate, formatMoney } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  await connect();
  const adDoc = await AdModel.findById(args.params.id);
  const session = await getServerSession(authOptions);

  if (!adDoc) {
    return "Not Found!!!";
  }

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 top-28 gap-4 p-4">
      {/* Gallery - Full width on mobile, 3/5 on desktop */}
      <div className="w-full md:w-3/5 bg-black text-white flex flex-col relative rounded-md min-h-[300px]">
        <Gallery files={adDoc.files} />
      </div>

      {/* Ad details - Full width on mobile, 2/5 on desktop */}
      <div
        className="w-full md:w-2/5 p-4 md:p-6 grow-0 bg-gradient-to-r from-black to-blue-500 rounded-lg 
        shadow-lg flex flex-col space-y-4 text-white max-h-[calc(100vh-8rem)] overflow-y-auto"
      >
        <h1 className="text-2xl md:text-4xl font-serif font-bold">
          {adDoc.title}
        </h1>

        {session && session?.user?.email === adDoc.userEmail && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/edit/${adDoc._id}`}
              className="border border-blue-600 text-blue-600 rounded-md py-1 px-4 inline-flex gap-2 items-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faPencil} />
              <span>Edit</span>
            </Link>
            <DeleteAdButton id={adDoc._id} />
          </div>
        )}

        <div className="space-y-1 md:space-y-2">
          <label className="text-sm md:text-base">Price</label>
          <p className="text-xl md:text-2xl font-bold">
            {formatMoney(adDoc.price)}
          </p>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="font-semibold text-sm md:text-base">
            Category:
          </label>
          <p className="bg-white text-gray-800 capitalize p-2 rounded-md opacity-80">
            {adDoc.category}
          </p>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="font-semibold text-sm md:text-base">
            Description:
          </label>
          <p className="bg-white text-gray-800 p-2 rounded-md opacity-80 text-sm">
            {adDoc.description}
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-sm md:text-base">Contact:</label>
          <p className="bg-white text-gray-800 p-2 rounded-md opacity-80">
            {adDoc.contact}
          </p>

          <label className="text-sm md:text-base">Location</label>
          <LocationMap
            className="w-full h-48 md:h-64 rounded-lg"
            location={adDoc.location}
          />

          <p className="mt-2 md:mt-4 text-gray-400 text-xs">
            Posted: {formatDate(adDoc.createdAt)} <br />
            Last Updated: {formatDate(adDoc.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
