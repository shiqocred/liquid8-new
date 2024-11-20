"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { Slider } from "@/components/ui/slider";
import { Printer, XCircle } from "lucide-react";

export const PrintProductSaleModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "print-product-sale-modal";
  const [scale, setScale] = useState([100]);

  function convertToRoman(num: number): string {
    const romanNumerals: { value: number; symbol: string }[] = [
      { value: 1000, symbol: "M" },
      { value: 900, symbol: "CM" },
      { value: 500, symbol: "D" },
      { value: 400, symbol: "CD" },
      { value: 100, symbol: "C" },
      { value: 90, symbol: "XC" },
      { value: 50, symbol: "L" },
      { value: 40, symbol: "XL" },
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ];

    let result = "";
    for (const { value, symbol } of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  }

  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    pageStyle: `@page { margin: 20mm 20mm 20mm 20mm !important; }`,
    documentTitle: `Document By Product - ${data?.buyer?.code_document_sale}`,
    content: () => componentRef.current,
  });

  return (
    <Modal
      title="Export By Products"
      description="Print document / Save as PDF file"
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-5xl min-h-[90vh] justify-start flex flex-col"
    >
      <div className="h-[70vh] w-full justify-center flex overflow-hidden">
        <div
          className={cn(
            "justify-center flex w-full",
            componentRef.current &&
              componentRef.current.offsetHeight * (scale[0] / 100) >
                window.innerHeight * 0.7 &&
              `overflow-y-scroll`
          )}
          style={{
            height: componentRef.current
              ? componentRef.current.offsetHeight * (scale[0] / 100) >
                window.innerHeight * 0.7
                ? `${window.innerHeight * 0.7}px`
                : `${componentRef.current.offsetHeight * (scale[0] / 100)}px`
              : "0px",
          }}
          ref={containerRef}
        >
          <div
            className="origin-top w-fit h-fit border shadow rounded-md p-20"
            style={{ scale: scale[0] / 100 }}
          >
            <div
              className="text-xs w-[21cm] min-h-[29.7cm] leading-normal"
              ref={componentRef}
            >
              {/* header */}
              <div className="w-full flex justify-between items-center pb-3 mb-3 border-b-2 border-black">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">FORM VALIDASI</h3>
                  <p>
                    {data?.buyer?.code_document_sale +
                      "/LMS/" +
                      convertToRoman(new Date().getMonth() + 1) +
                      "/" +
                      new Date().getFullYear()}
                  </p>
                </div>
                <div className="relative aspect-[20/7] w-32">
                  <Image
                    src={"/images/logo-barcode.png"}
                    alt="barcode"
                    className="object-contain"
                    fill
                  />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex flex-col font-bold">
                  <p>Cashier ID</p>
                  <p>Sales Reference</p>
                </div>
                <div className="flex flex-col">
                  <p>: {data?.data?.transactions_today}</p>
                  <p>: _______________________</p>
                </div>
              </div>
              <h3 className="font-bold my-3">A. Identitas Pembeli</h3>
              <div className="w-[99.8%] flex flex-col border border-black">
                <div className="w-full flex">
                  <div className="flex w-full">
                    <p className="w-24 flex-none px-3 py-0.5 border-r border-black font-bold ">
                      Nama
                    </p>
                    <p className="w-full px-3 py-0.5 border-r border-black uppercase">
                      {data?.buyer?.buyer_name_document_sale}
                    </p>
                  </div>
                  <div className="flex w-1/3 flex-none">
                    <p className="w-1/3 flex-none px-3 py-0.5 border-r border-black font-bold">
                      NPWP
                    </p>
                    <p className="w-full px-3 py-0.5">-</p>
                  </div>
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="flex w-full">
                    <p className="w-24 flex-none px-3 py-0.5 border-r border-black font-bold">
                      No. HP
                    </p>
                    <p className="w-full px-3 py-0.5 border-r border-black">
                      {data?.buyer?.buyer_phone_document_sale}
                    </p>
                  </div>
                  <div className="flex w-1/3 flex-none">
                    <p className="w-1/3 flex-none px-3 py-0.5 border-r border-black font-bold">
                      Tanggal
                    </p>
                    <p className="w-full px-3 py-0.5">
                      {format(
                        new Date(
                          data?.buyer?.created_at ?? new Date().toString()
                        ),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="flex w-full">
                    <p className="w-24 flex-none px-3 py-0.5 border-r border-black font-bold">
                      Alamat
                    </p>
                    <p className="w-full px-3 py-0.5 capitalize">
                      {data?.buyer?.buyer_address_document_sale}
                    </p>
                  </div>
                </div>
              </div>
              <p className="my-3 text-justify indent-5">
                Bahwa yang bersangkutan di atas telah melakukan pemilihan dan
                pemilahan atas barang yang berada di area Liquid8 Wholesale dan
                sepakat untuk melakukan pembelian sebagaimana detail barang &
                harga berlaku di bawah:
              </p>
              <h3 className="font-bold my-3">
                B. Informasi Harga Jual & Diskon berlaku
              </h3>
              <div className="w-[99.8%] flex-col flex border-2 border-black">
                <div className="w-full flex font-bold">
                  <div className="w-10 flex-none border-r border-black text-center py-0.5">
                    No
                  </div>
                  <div className="w-36 flex-none border-r border-black px-3 py-0.5">
                    Barcode
                  </div>
                  <div className="w-full border-r border-black px-3 py-0.5">
                    Nama Barang
                  </div>
                  <div className="w-12 flex-none border-r border-black text-center py-0.5">
                    Qty
                  </div>
                  <div className="w-32 flex-none px-3 py-0.5">Harga</div>
                </div>
                <div className="flex w-full flex-col relative">
                  {data?.buyer?.sales &&
                    data?.buyer?.sales.map((item: any, index: number) => (
                      <div
                        key={
                          item.barcode +
                          item.product_name_sale +
                          item.product_qty_sale +
                          item.product_price_sale
                        }
                        className="w-full flex border-t border-black first:border-t-2"
                      >
                        <div className="w-10 flex-none border-r border-black text-center py-0.5">
                          {index + 1}
                        </div>
                        <div className="w-36 flex-none border-r border-black px-3 py-0.5 uppercase">
                          {item.product_barcode_sale}
                        </div>
                        <div className="w-full border-r border-black px-3 py-0.5 capitalize">
                          {item.product_name_sale}
                        </div>
                        <div className="w-12 flex-none border-r border-black text-center  py-0.5">
                          {item.product_qty_sale}
                        </div>
                        <div className="w-32 flex-none px-3 py-0.5">
                          {formatRupiah(item.product_price_sale) ?? "Rp 0"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full flex items-end flex-col mt-3 font-bold">
                <div className="flex">
                  <p className="px-3">Subtotal</p>
                  <p className="w-12 flex-none text-center">
                    {data?.buyer?.total_product_document_sale}
                  </p>
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    {formatRupiah(data?.buyer?.total_display_document_sale) ??
                      "Rp 0"}
                  </p>
                </div>
                <div className="flex">
                  <p className="px-3">
                    Kardus @
                    {formatRupiah(data?.buyer?.cardbox_unit_price) ?? "Rp 0"}
                  </p>
                  <p className="w-12 flex-none text-center">
                    {data?.buyer?.cardbox_qty}
                  </p>
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    {formatRupiah(data?.buyer?.cardbox_total_price) ?? "Rp 0"}
                  </p>
                </div>
                <div className="flex">
                  <p className="px-3">Voucher</p>
                  <p className="w-12 flex-none" />
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    -{formatRupiah(data?.buyer?.voucher) ?? "Rp 0"}
                  </p>
                </div>
                <div className="flex">
                  <p className="px-3">Total</p>
                  <p className="w-12 flex-none" />
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    {formatRupiah(data?.buyer?.grand_total) ?? "Rp 0"}
                  </p>
                </div>
              </div>
              <div className="my-3">
                <h5 className="font-bold underline">Catatan Pembelian</h5>
                <p className="text-justify indent-5 mt-3">
                  Masing-masing pihak tidak bertanggung jawab atas, perbuatan
                  melawan hukum, kelalaian, pelanggaran atau segala kerugian,
                  kerusakan, ongkos atau biaya dalam bentuk apapun yang harus
                  dibayar atau diderita oleh pihak yang lain:
                </p>
                <ul className="ml-5">
                  <li>
                    (a) baik yang bersifat tidak langsung atau konsekuensial
                    atau
                  </li>
                  <li>
                    (b) yang terkait dengan kerugian ekonomi, keuntungan atau
                    reputasi bisnis.
                  </li>
                </ul>
              </div>
              <div className="w-full flex mt-6 font-bold">
                <div className="w-full flex justify-center flex-col items-center">
                  <p></p>
                  <p className="h-20" />
                  <p className="uppercase border-b px-3 border-black">
                    {data?.buyer?.buyer_name_document_sale}
                  </p>
                  <p>Nama Pembeli</p>
                </div>
                <div className="w-full flex justify-center flex-col items-center">
                  <p>Dibuat:</p>
                  <p className="h-20"></p>
                  <p className="uppercase border-b px-3 border-black">
                    {data?.data?.name_user}
                  </p>
                  <p>Admin Kasir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-6 justify-between">
        <div className="flex gap-4 items-center">
          <Button
            onClick={onClose}
            className="bg-gray-300/80 text-black rounded-full hover:bg-gray-300"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-sky-400/80 text-black rounded-full hover:bg-sky-400"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
        <div className="w-1/3 flex gap-2 items-center">
          <Slider
            defaultValue={scale}
            max={100}
            min={10}
            step={1}
            onValueChange={(e) => setScale(e)}
          />
          <p className="text-sm w-1/5 text-center">{scale[0]}%</p>
        </div>
      </div>
    </Modal>
  );
};
