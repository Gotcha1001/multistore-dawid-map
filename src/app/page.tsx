"use client";

import AdItem from "@/components/AdItem";
import SearchForm from "@/components/SearchForm";
import { defaultRadius } from "@/libs/helpers";
import { Ad } from "@/models/Ad";
import { useState } from "react";

export default function Home() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [adsParams, setAdsParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function fetchAds(params?: URLSearchParams) {
    if (!params) {
      params = new URLSearchParams();
    }
    if (!params.get("center")) {
      console.log("Center is missing in params. Exiting fetchAds.");
      return;
    }
    if (!params.has("radius")) {
      params.set("radius", defaultRadius.toString());
    }

    const url = `/api/ads?${params?.toString() || ""}`;
    console.log("Fetching ads with URL:", url);

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text(); // Capture response text for debugging
          console.error("Response was not ok:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((adsDocs) => {
        console.log("Fetched ads:", adsDocs);
        setAds(adsDocs);
        setAdsParams(params);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
      });
  }

  function handleSearch(formData: FormData) {
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        params.set(key, value);
      }
    });
    fetchAds(params);
    setIsFilterOpen(false); // Close filter on mobile after search
  }

  const formDirty =
    adsParams.get("phrase") ||
    adsParams.get("category") ||
    adsParams.get("min") ||
    adsParams.get("max");

  return (
    <div className="flex flex-col lg:flex-row w-full relative">
      {/* Filter Toggle Button on Top */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="lg:hidden p-2 bg-blue-500 text-white rounded shadow-md mb-4"
      >
        {isFilterOpen ? "Close Filters" : "Show Filters"}
      </button>

      {/* Search Form */}
      <div
        className={`${
          isFilterOpen ? "fixed inset-0 z-40 bg-white" : "hidden"
        } lg:relative lg:block lg:w-1/4`}
      >
        <SearchForm action={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="p-4 grow w-full lg:w-3/4 gradient-background2 rounded-md">
        <h2 className="font-bold mt-2 mb-4 text-white">
          {formDirty ? "Search Results" : "Latest Ads"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-3">
          {ads && ads.map((ad) => <AdItem key={ad._id} ad={ad} />)}
        </div>
        {ads && ads.length === 0 && (
          <div className="text-gray-200">
            No Products Found...Enlarge the Radius...
          </div>
        )}
        {ads === null && (
          <div className="text-gray-400">
            Click Search To Find Products or a Category...
          </div>
        )}
      </div>
    </div>
  );
}
