import { connect } from "@/libs/helpers";
import { Ad, AdModel } from "@/models/Ad";
import { FilterQuery } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { PipelineStage } from "mongoose";

// Asynchronous function to handle GET requests
export async function GET(req: Request) {
  await connect();

  const { searchParams } = new URL(req.url);
  const phrase = searchParams.get("phrase");
  const category = searchParams.get("category");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const radius = searchParams.get("radius");
  const center = searchParams.get("center");

  const filter: FilterQuery<Ad> = {};

  const aggregationSteps: PipelineStage[] = [];

  if (phrase) {
    filter.title = {
      $regex: ".*" + phrase + ".*",
      $options: "i",
    };
  }
  if (category) {
    filter.category = category;
  }

  if (min && !max) {
    filter.price = { $gte: parseFloat(min) };
  }
  if (max && !min) {
    filter.price = { $lte: parseFloat(max) };
  }
  if (min && max) {
    filter.price = { $gte: parseFloat(min), $lte: parseFloat(max) };
  }

  if (radius && center) {
    const coords = center.split(",");
    aggregationSteps.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(coords[0]), parseFloat(coords[1])],
        },
        distanceField: "distance",
        maxDistance: parseFloat(radius),
        spherical: true,
      },
    });
  }

  aggregationSteps.push({
    $match: filter,
  });

  aggregationSteps.push({
    $sort: { createdAt: -1 },
  });

  // Step 6: Query the Ad collection, applying the filter and sorting by creation date (newest first)
  const adsDocs = await AdModel.aggregate(aggregationSteps);

  // Step 7: Return the retrieved documents (ads) as a JSON response
  return Response.json(adsDocs);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  await connect();
  const adDoc = await AdModel.findById(id);
  const session = await getServerSession(authOptions);
  if (!adDoc || adDoc.userEmail !== session?.user?.email) {
    return Response.json(false);
  }
  await AdModel.findByIdAndDelete(id);
  return Response.json(true);
}
