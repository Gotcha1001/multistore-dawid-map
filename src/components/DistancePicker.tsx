import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { Location } from "./LocationPicker";

export default function DistancePicker({
  onChange,
  defaultRadius,
}: {
  onChange: ({ radius, center }: { radius: number; center: Location }) => void;
  defaultRadius: number;
}) {
  const mapsDiv = useRef<HTMLDivElement | null>(null);
  const [radius, setRadius] = useState(defaultRadius);
  const [center, setCenter] = useState<Location | null>(null);
  const [zoom, setZoom] = useState<number>(7);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    const loadMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_KEY as string,
      });

      const Core = await loader.importLibrary("core");
      const { Map, Circle } = await loader.importLibrary("maps");

      const map = new Map(mapsDiv.current as HTMLDivElement, {
        mapId: "map",
        center: center,
        zoom: zoom,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: "greedy",
        zoomControl: true,
      });
      const circle = new Circle({
        map,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        center: center,
        radius,
      });

      Core.event.addListener(circle, "bounds_changed", () => {
        const newRadius = circle.getRadius();
        setRadius(newRadius);
        adjustMapZoom(map, newRadius); // Function to adjust zoom level
      });

      Core.event.addListener(circle, "center_changed", () => {
        const circleCenter: Location | undefined = circle.getCenter()?.toJSON();
        if (circleCenter) {
          setCenter(circleCenter);
          map.setCenter(circleCenter);
        }
      });
    };

    if (center) {
      loadMap();
      if (window && window.localStorage) {
        window.localStorage.setItem("center", JSON.stringify(center));
      }
    }

    if (!center && window.localStorage) {
      const centerFromLS = window.localStorage.getItem("center") || "";
      console.log("using center from LS");
      setCenter(JSON.parse(centerFromLS));
    }
  }, [center]); // Keep 'center' as dependency, we'll add others below

  useEffect(() => {
    if (center && radius) {
      onChange({ center, radius });
    }
  }, [radius, center, onChange]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (ev) => {
        setCenter({ lat: ev.coords.latitude, lng: ev.coords.longitude });
      },
      (err) => setGeoError(err.message)
    );
  }, []);

  // New function to adjust map zoom based on the radius
  const adjustMapZoom = (map: google.maps.Map, radius: number) => {
    if (radius > 1500000) map.setZoom(1);
    else if (radius > 800000) map.setZoom(2);
    else if (radius > 400000) map.setZoom(3);
    else if (radius > 180000) map.setZoom(4);
    else if (radius > 100000) map.setZoom(5);
    else if (radius > 50000) map.setZoom(6);
    else if (radius > 25000) map.setZoom(7);
    else if (radius > 11000) map.setZoom(8);
    else if (radius > 5000) map.setZoom(9);
    else if (radius <= 10000) map.setZoom(10);
    setZoom(map.getZoom() as number); // Update zoom state
  };

  return (
    <>
      <label>Where</label>
      <div ref={mapsDiv} className="w-full h-48 bg-gray-200 rounded-lg ">
        {(!center || geoError) && (
          <div className="text-gray-400  text-center gradient-background2 rounded-lg  p-4">
            {geoError || "Loading map..."}
          </div>
        )}
      </div>
    </>
  );
}
