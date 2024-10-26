import { connect } from "@/libs/helpers";
import { AdModel } from "@/models/Ad";
import { FilterQuery, PipelineStage } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

// Asynchronous function to handle GET requests
export async function GET(req: Request) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const phrase = searchParams.get("phrase");
    const category = searchParams.get("category");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const radius = searchParams.get("radius");
    const center = searchParams.get("center");

    const filter: FilterQuery<any> = {};
    const aggregationSteps: PipelineStage[] = [];

    if (phrase) {
      filter.title = { $regex: `.*${phrase}.*`, $options: "i" };
    }
    if (category) filter.category = category;

    if (min && !max) filter.price = { $gte: parseFloat(min) };
    if (max && !min) filter.price = { $lte: parseFloat(max) };
    if (min && max)
      filter.price = { $gte: parseFloat(min), $lte: parseFloat(max) };

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

    aggregationSteps.push({ $match: filter });
    aggregationSteps.push({ $sort: { createdAt: -1 } });

    const adsDocs = await AdModel.aggregate(aggregationSteps);
    const plainAdsDocs = adsDocs.map((ad) => JSON.parse(JSON.stringify(ad)));

    return new Response(JSON.stringify(plainAdsDocs), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch ads" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  await connect();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const adDoc = await AdModel.findById(id);
    const session = await getServerSession(authOptions);

    if (!adDoc || adDoc.userEmail !== session?.user?.email) {
      return new Response(JSON.stringify({ success: false }), { status: 403 });
    }

    await AdModel.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to delete ad" }),
      {
        status: 500,
      }
    );
  }
}
