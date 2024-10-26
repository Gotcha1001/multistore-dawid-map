import { Loader } from "@googlemaps/js-api-loader";
import { createRef, HTMLAttributes, useEffect } from "react";
import { Location } from "./LocationPicker";

type Props = HTMLAttributes<HTMLDivElement> & {
  location: Location;
};

export default function LocationMap({ location, ...divProps }: Props) {
  const mapsDivRef = createRef<HTMLDivElement>();

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
    };

    loadMap();
  }, [location]); // Include 'location' in the dependency array

  return (
    <>
      <div {...divProps} ref={mapsDivRef}></div>
    </>
  );
}
