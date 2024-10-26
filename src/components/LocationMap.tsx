"use client"; // Add this line to specify that this is a Client Component

import { Loader } from "@googlemaps/js-api-loader";
import { HTMLAttributes, useEffect, useRef } from "react";
import { Location } from "./LocationPicker";

type Props = HTMLAttributes<HTMLDivElement> & {
  location: Location;
};

export default function LocationMap({ location, ...divProps }: Props) {
  const mapsDivRef = useRef<HTMLDivElement>(null); // Use useRef instead of createRef

  useEffect(() => {
    const loadMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_KEY as string,
      });
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const map = new Map(mapsDivRef.current as HTMLDivElement, {
        mapId: "map",
        center: location,
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: "greedy",
        zoomControl: true,
      });

      new AdvancedMarkerElement({
        map,
        position: location,
      });

      // Optional: Return a cleanup function to remove the map
      return () => {
        if (mapsDivRef.current) {
          mapsDivRef.current.innerHTML = ""; // Clear the map when unmounting
        }
      };
    };

    const cleanup = loadMap();

    return () => {
      // Cleanup logic if necessary
      cleanup?.(); // Call the cleanup function if it exists
    };
  }, [location]); // Include 'location' in the dependency array

  return (
    <>
      <div
        {...divProps}
        ref={mapsDivRef}
        style={{ width: "100%", height: "100%" }} // Ensure the map takes full space
      ></div>
    </>
  );
}
