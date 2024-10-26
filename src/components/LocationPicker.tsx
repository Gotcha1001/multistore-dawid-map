import { useEffect, useCallback, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export type Location = {
  lat: number;
  lng: number;
};

export default function LocationPicker({
  defaultLocation,
  onChange,
  gpsCoords,
}: {
  defaultLocation: Location;
  onChange: (location: Location) => void;
  gpsCoords: Location | null;
}) {
  const divRef = useRef<HTMLDivElement | null>(null); // Use useRef instead of createRef

  const loadMap = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_KEY as string,
    });
    const { Map } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");

    if (divRef.current) {
      const map = new Map(divRef.current, {
        mapId: "map",
        center: defaultLocation,
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: "greedy",
      });

      const pin = new AdvancedMarkerElement({
        map,
        position: defaultLocation,
      });

      map.addListener("click", (ev: google.maps.MapMouseEvent) => {
        if (ev.latLng) {
          pin.position = ev.latLng;
          const lat = ev.latLng.lat();
          const lng = ev.latLng.lng();
          onChange({ lat, lng });
        }
      });
    }
  }, [defaultLocation, onChange]); // Updated dependencies

  useEffect(() => {
    loadMap();
  }, [loadMap]); // Included loadMap in the dependency array

  useEffect(() => {
    loadMap();
  }, [loadMap, gpsCoords]); // Include gpsCoords as a dependency if needed

  return (
    <>
      <div ref={divRef} id="map" className="w-full h-[200px]"></div>
    </>
  );
}
