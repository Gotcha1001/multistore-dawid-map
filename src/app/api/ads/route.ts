import { connect } from "@/libs/helpers";
import { Ad, AdModel } from "@/models/Ad";
import { FilterQuery } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { PipelineStage } from "mongoose";

export async function GET(req: Request) {
  try {
    console.log("GET request received");

    await connect();
    console.log("Database connected");

    const { searchParams } = new URL(req.url);
    const phrase = searchParams.get("phrase");
    const category = searchParams.get("category");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const radius = searchParams.get("radius");
    const center = searchParams.get("center");

    console.log("Parsed query parameters:", {
      phrase,
      category,
      min,
      max,
      radius,
      center,
    });

    const filter: FilterQuery<Ad> = {};
    const aggregationSteps: PipelineStage[] = [];

    if (phrase) {
      filter.title = { $regex: ".*" + phrase + ".*", $options: "i" };
      console.log("Added phrase filter:", filter.title);
    }
    if (category) {
      filter.category = category;
      console.log("Added category filter:", category);
    }

    if (min && !isNaN(parseFloat(min))) {
      filter.price = { ...filter.price, $gte: parseFloat(min) };
      console.log("Added minimum price filter:", filter.price);
    }
    if (max && !isNaN(parseFloat(max))) {
      filter.price = { ...filter.price, $lte: parseFloat(max) };
      console.log("Added maximum price filter:", filter.price);
    }

    if (radius && center) {
      const coords = center.split(",");
      console.log("Parsed coordinates for geo query:", coords);
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
    console.log("Aggregation steps before sorting:", aggregationSteps);

    aggregationSteps.push({ $sort: { createdAt: -1 } });
    console.log("Aggregation steps after sorting:", aggregationSteps);

    const adsDocs = await AdModel.aggregate(aggregationSteps);
    console.log("Retrieved ads documents:", adsDocs);

    return Response.json(adsDocs || []);
  } catch (error) {
    console.error("Error in GET request:", error);
    return Response.json({ error: "Failed to fetch ads." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("DELETE request received");

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    console.log("Parsed ad ID for deletion:", id);

    await connect();
    console.log("Database connected");

    const session = await getServerSession(authOptions);
    if (!session) {
      console.warn("Session not found. Unauthorized access attempt.");
      return Response.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }
    console.log("Session retrieved:", session);

    const adDoc = await AdModel.findById(id);
    if (!adDoc) {
      console.warn("Ad document not found with ID:", id);
      return Response.json(
        { success: false, message: "Ad not found" },
        { status: 404 }
      );
    }
    console.log("Ad document retrieved:", adDoc);

    if (adDoc.userEmail !== session.user.email) {
      console.warn(
        "Unauthorized access: user email does not match ad owner email."
      );
      return Response.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    await AdModel.findByIdAndDelete(id);
    console.log("Ad document deleted successfully");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return Response.json(
      { success: false, error: "Failed to delete ad." },
      { status: 500 }
    );
  }
}
