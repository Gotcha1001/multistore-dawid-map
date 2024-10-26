"use client";

import AdForm from "@/components/AdForm";

const locationDefault = {
  lat: -29.78526006662728,
  lng: 31.041701528306643,
};

export default function NewAdPage() {
  return (
    <div className="w-full bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-5xl lg:max-w-4xl">
        {" "}
        {/* Adjust max width for different breakpoints */}
        <AdForm defaultLocation={locationDefault} />
      </div>
    </div>
  );
}
