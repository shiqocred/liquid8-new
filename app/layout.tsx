import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import { ToastProvider } from "@/providers/toast-provider";
import ModalProvider from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Liquid8",
    default: "Liquid8 - Liquidasi Retail Online", // a default is required when creating a template
  },
  description:
    "Perusahaan likuidasi hulu ke hiir pertama di Indonesia. Pusat grosir barang gagal kirim COD marketplace dengan diskon upto 70%.",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/images/liquid_32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/images/liquid_96x96.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <ToastProvider />
          <ModalProvider />
          {children}
        </CookiesProvider>
      </body>
    </html>
  );
}
