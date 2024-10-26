import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdForm from "@/components/AdForm";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function EditPage(props: Props) {
  const id = props.params.id;

  await connect();
  const session = await getServerSession(authOptions);
  const adDoc = await AdModel.findById(id);

  if (!adDoc) {
    return "404 not found";
  }

  if (session?.user?.email !== adDoc?.userEmail) {
    return "Not Yours";
  }

  // Serialize adDoc properties to plain objects or simple types
  const serializedAdDoc = {
    _id: adDoc._id.toString(), // Ensure _id is a string
    title: adDoc.title,
    price: adDoc.price,
    category: adDoc.category,
    description: adDoc.description,
    contact: adDoc.contact,
    location: adDoc.location, // Ensure location is a plain object or string
    files: adDoc.files || [], // Ensure files are an array of simple types
    createdAt: adDoc.createdAt.toISOString(), // Format dates as strings
    updatedAt: adDoc.updatedAt.toISOString(),
    userEmail: adDoc.userEmail,
  };

  return (
    <AdForm
      id={serializedAdDoc._id}
      defaultTexts={{
        title: serializedAdDoc.title,
        price: serializedAdDoc.price,
        category: serializedAdDoc.category,
        description: serializedAdDoc.description,
        contact: serializedAdDoc.contact,
      }}
      defaultFiles={serializedAdDoc.files}
      defaultLocation={serializedAdDoc.location} // Ensure this is a serializable format
    />
  );
}
