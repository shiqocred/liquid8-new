import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export const provinces = [
  { id: 1, nama: "Aceh", slug: "aceh" },
  { id: 2, nama: "Sumatera Utara", slug: "sumatera_utara" },
  { id: 3, nama: "Sumatera Barat", slug: "sumatera_barat" },
  { id: 4, nama: "Riau", slug: "riau" },
  { id: 5, nama: "Jambi", slug: "jambi" },
  { id: 6, nama: "Sumatera Selatan", slug: "sumatera_selatan" },
  { id: 7, nama: "Bengkulu", slug: "bengkulu" },
  { id: 8, nama: "Lampung", slug: "lampung" },
  {
    id: 9,
    nama: "Kep. Bangka Belitung",
    slug: "kep_bangka_belitung",
  },
  { id: 10, nama: "Kep. Riau", slug: "kep_riau" },
  { id: 11, nama: "DKI Jakarta", slug: "dki_jakarta" },
  { id: 12, nama: "Jawa Barat", slug: "jawa_barat" },
  { id: 13, nama: "Jawa Tengah", slug: "jawa_tengah" },
  { id: 14, nama: "DI Yogyakarta", slug: "di_yogyakarta" },
  { id: 15, nama: "Jawa Timur", slug: "jawa_timur" },
  { id: 16, nama: "Banten", slug: "banten" },
  { id: 17, nama: "Bali", slug: "bali" },
  { id: 18, nama: "Nusa Tenggara Barat", slug: "nusa_tenggara_barat" },
  { id: 19, nama: "Nusa Tenggara Timur", slug: "nusa_tenggara_timur" },
  { id: 20, nama: "Kalimantan Barat", slug: "kalimantan_barat" },
  { id: 21, nama: "Kalimantan Tengah", slug: "kalimantan_tengah" },
  { id: 22, nama: "Kalimantan Selatan", slug: "kalimantan_selatan" },
  { id: 23, nama: "Kalimantan Timur", slug: "kalimantan_timur" },
  { id: 24, nama: "Kalimantan Utara", slug: "kalimantan_utara" },
  { id: 25, nama: "Sulawesi Utara", slug: "sulawesi_utara" },
  { id: 26, nama: "Sulawesi Tengah", slug: "sulawesi_tengah" },
  { id: 27, nama: "Sulawesi Selatan", slug: "sulawesi_selatan" },
  { id: 28, nama: "Sulawesi Tenggara", slug: "sulawesi_tenggara" },
  { id: 29, nama: "Gorontalo", slug: "gorontalo" },
  { id: 30, nama: "Sulawesi Barat", slug: "sulawesi_barat" },
  { id: 31, nama: "Maluku", slug: "maluku" },
  { id: 32, nama: "Maluku Utara", slug: "maluku_utara" },
  { id: 33, nama: "Papua Barat", slug: "papua_barat" },
  { id: 34, nama: "Papua Barat Daya", slug: "papua_barat_daya" },
  { id: 35, nama: "Papua", slug: "papua" },
  { id: 36, nama: "Papua Selatan", slug: "papua_selatan" },
  { id: 37, nama: "Papua Tengah", slug: "papua_tengah" },
  { id: 38, nama: "Papua Pegunungan", slug: "papua_pegunungan" },
];
