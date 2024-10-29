import { categories, defaultRadius } from "@/libs/helpers";
import LabelRadioButton from "./LabelRadioButton";
import SubmitButton from "./SubmitButton";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
// import DistancePicker from "./DistancePicker";
import { Location } from "./LocationPicker";

type Props = {
  action: (data: FormData) => void;
};

// SearchForm.tsx
export default function SearchForm({ action }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  // const [radius, setRadius] = useState(defaultRadius);
  // const [center, setCenter] = useState<Location | null>(null);
  const [prevCenter, setPrevCenter] = useState<Location | null>(null);

  // useEffect(() => {
  //   if (center && !prevCenter) {
  //     formRef.current?.requestSubmit();
  //     setPrevCenter(center);
  //   }
  // }, [center, prevCenter]);

  return (
    <form
      ref={formRef}
      action={action}
      className="bg-white h-full p-4 overflow-y-auto flex flex-col gap-4"
    >
      <input
        name="phrase"
        type="text"
        placeholder="Search MarketPlace"
        className="w-full p-2 border rounded"
      />

      <div className="flex flex-col gap-2">
        <LabelRadioButton
          name={"category"}
          icon={faStore}
          label={"All Categories"}
          onClick={() => formRef.current?.requestSubmit()}
          value={""}
          defaultChecked={true}
        />
        {categories.map(({ key: categoryKey, label, icon }) => (
          <LabelRadioButton
            key={categoryKey}
            name={"category"}
            icon={icon}
            label={label}
            onClick={() => formRef.current?.requestSubmit()}
            value={categoryKey}
          />
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Filter By Price</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="min"
            type="number"
            placeholder="minimum"
            className="w-full p-2 border rounded"
          />
          <input
            name="max"
            type="number"
            placeholder="maximum"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <input type="hidden" name="radius" value={radius} />
        <input
          type="hidden"
          name="center"
          value={center?.lat + "," + center?.lng}
        />
        {/* <DistancePicker
          defaultRadius={defaultRadius}
          onChange={({ radius, center }) => {
            setRadius(radius);
            setCenter(center);
          }}
        /> */}
      </div>

      <SubmitButton className="w-full">Search</SubmitButton>
    </form>
  );
}
