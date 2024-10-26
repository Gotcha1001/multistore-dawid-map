"use server";

import { AdModel } from "@/models/Ad";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

async function connect() {
  return mongoose.connect(process.env.MONGODB_URL as string);
}

export async function createAd(formData: FormData) {
  const { files, location, ...data } = Object.fromEntries(formData);
  await connect();
  const session = await getServerSession(authOptions);
  const newAdData = {
    ...data,
    files: JSON.parse(files as string),
    location: JSON.parse(location as string),
    userEmail: session?.user?.email,
  };

  const newAdDOc = await AdModel.create(newAdData);
  return JSON.parse(JSON.stringify(newAdDOc));
}

export async function updataAd(formData: FormData) {
  const { _id, files, location, ...data } = Object.fromEntries(formData);
  await connect();
  const adDoc = await AdModel.findById(_id);
  const session = await getServerSession(authOptions);
  if (!adDoc || adDoc?.userEmail !== session?.user?.email) {
    return;
  }
  const adData = {
    ...data,
    files: JSON.parse(files as string),
    location: JSON.parse(location as string),
    userEmail: session?.user?.email,
  };

  const newAdDOc = await AdModel.findByIdAndUpdate(_id, adData);

  revalidatePath("/ad/" + _id);

  return JSON.parse(JSON.stringify(newAdDOc));
}
