import { categories } from "@/libs/helpers";
import { option } from "framer-motion/client";

export type AdTexts = {
  title?: string;
  price?: string | number;
  category?: string;
  description?: string;
  contact?: string;
};

type Props = {
  defaultValues: AdTexts;
};

export default function AdTextInputs({ defaultValues }: Props) {
  return (
    <>
      <label htmlFor="titleIn">Title: </label>
      <input
        name="title"
        id="titleIn"
        type="text"
        placeholder="Title"
        defaultValue={defaultValues.title}
      />

      <label htmlFor="priceIn">Price: </label>
      <input
        name="price"
        id="priceIn"
        type="number"
        placeholder="Price"
        defaultValue={defaultValues.price}
      />

      <label htmlFor="categoryIn">Category</label>
      <select
        name="category"
        id="categoryIn"
        defaultValue={defaultValues.category || "0"}
      >
        <option disabled value="0">
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category.key} value={category.key}>
            {category.label}
          </option>
        ))}
      </select>

      <label htmlFor="descriptionIn">Description</label>
      <textarea
        name="description"
        id="descriptionIn"
        placeholder="Description"
        defaultValue={defaultValues.description}
      ></textarea>

      <label htmlFor="contactIn">Contact Information: </label>
      <textarea
        name="contact"
        id="contactIn"
        placeholder="Mobile +27 824 484 332"
        defaultValue={defaultValues.contact}
      ></textarea>
    </>
  );
}
