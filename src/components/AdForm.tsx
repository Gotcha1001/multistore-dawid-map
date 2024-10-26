"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { UploadedFile } from "./UploadArea"; // Import the new type from UploadArea
import {
  faLocationCrosshairs,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubmitButton from "./SubmitButton";
import UploadArea from "./UploadArea";
import LocationPicker, { Location } from "./LocationPicker";
import AdTextInputs, { AdTexts } from "./AdTextInputs";
import { createAd, updataAd } from "@/app/actions/adActions";

type Props = {
  id?: string | null;
  defaultFiles?: UploadedFile[];
  defaultLocation: Location;
  defaultTexts?: AdTexts;
};

export default function AdForm({
  id = null,
  defaultFiles = [],
  defaultLocation,
  defaultTexts = {},
}: Props) {
  const [files, setFiles] = useState<UploadedFile[]>(defaultFiles);
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [gpsCoords, setGpsCoords] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  function handleFindMyPositionClick() {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (ev) => {
        const location = { lat: ev.coords.latitude, lng: ev.coords.longitude };
        setLocation(location);
        setGpsCoords(location);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
      }
    );
  }

  async function handleSubmit(formData: FormData) {
    formData.set("location", JSON.stringify(location));
    formData.set("files", JSON.stringify(files));
    if (id) {
      formData.set("_id", id);
    }
    const result = id ? await updataAd(formData) : await createAd(formData);
    redirect("/ad/" + result._id);
  }

  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <form
        action={handleSubmit}
        className="max-w-2xl mx-auto gradient-background2 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
      >
        {/* Header */}
        <div className="gradient-background2 px-6 py-4">
          <h2 className="text-2xl font-semibold text-white text-center">
            {id ? "Edit Advertisement" : "Create New Advertisement"}
          </h2>
        </div>

        <div className="p-6 sm:p-8 gradient-background1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload and Location */}
            <div className="space-y-8">
              {/* Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-medium  text-gray-200">
                  Upload Files
                </label>
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md">
                  <UploadArea files={files} setFiles={setFiles} />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-200">
                  Location
                </label>
                <button
                  type="button"
                  onClick={handleFindMyPositionClick}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  <FontAwesomeIcon
                    icon={isLocating ? faSpinner : faLocationCrosshairs}
                    className={isLocating ? "animate-spin" : ""}
                  />
                  <span className="text-gray-700">
                    {isLocating ? "Finding location..." : "Find My Position"}
                  </span>
                </button>

                <div className="bg-gray-100 rounded-lg p-4 shadow-md">
                  <LocationPicker
                    defaultLocation={defaultLocation}
                    gpsCoords={gpsCoords}
                    onChange={(location) => setLocation(location)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Text Inputs and Submit */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <AdTextInputs defaultValues={defaultTexts} />
              </div>

              <div className="pt-4">
                <SubmitButton className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  {id ? "Save Changes" : "Publish Advertisement"}
                </SubmitButton>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
