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


const baseUrlLocal = "https://wms-server.digitalindustryagency.com/api";
const baseUrlProduction = "https://server.wms-liquid8.online/api";

export const baseUrl = baseUrlLocal;

export function formatDate(tanggalString: string) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const options: any = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
  const tanggal = new Date(tanggalString);

  const hari = days[tanggal.getDay()];
  const tanggalFormat = tanggal.toLocaleDateString('id-ID', options);

  const [tanggalPart, bulanPart, tahunPart] = tanggalFormat.split('/');
  const formattedTanggal = `${tanggalPart}-${bulanPart.padStart(2, '0')}-${tahunPart}`;

  return formattedTanggal;
}
