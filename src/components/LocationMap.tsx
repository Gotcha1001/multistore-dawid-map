"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { HTMLAttributes, useEffect, useRef } from "react";
import { Location } from "./LocationPicker";

type Props = HTMLAttributes<HTMLDivElement> & {
  location: Location;
};

export default function LocationMap({ location, ...divProps }: Props) {
  const mapsDivRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

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

      // Store the cleanup function
      cleanupRef.current = () => {
        if (mapsDivRef.current) {
          mapsDivRef.current.innerHTML = "";
        }
      };
    };

    loadMap().catch(console.error);

    // Return cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [location]);

  return (
    <div
      {...divProps}
      ref={mapsDivRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
