import {
  faCar,
  faHome,
  faMobile,
  faMusic,
  faTshirt,
} from "@fortawesome/free-solid-svg-icons";
import mongoose from "mongoose";

export async function connect() {
  return mongoose.connect(process.env.MONGODB_URL as string);
}

// Array of categories with a key, label, and corresponding FontAwesome icon
export const categories = [
  { key: "cars", label: " Cars", icon: faCar },
  { key: "electronics", label: " Electronics", icon: faMobile },
  { key: "properties", label: " Properties", icon: faHome },
  { key: "clothes", label: " Clothes", icon: faTshirt },
  { key: "instruments", label: " Instruments", icon: faMusic },
];

export function formatMoney(amount: number): string {
  return Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

export const defaultRadius = 50 * 1000;

export function formatDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, options);
}
