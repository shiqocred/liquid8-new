import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const baseUrlLocal = "https://wms-server.digitalindustryagency.com/api";
const baseUrlProduction = "https://server.wms-liquid8.online/api";

export const baseUrl = baseUrlLocal;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(rupiah: number) {
  if (rupiah) {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(rupiah);
  }
}
