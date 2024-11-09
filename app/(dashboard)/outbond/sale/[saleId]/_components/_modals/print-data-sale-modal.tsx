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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Printer,
  SquareArrowOutUpRight,
  X,
  XCircle,
} from "lucide-react";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const PrintDataSaleModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "print-data-sale-modal";
  const [scale, setScale] = useState([100]);
  const [settingOpen, setSettingOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(true);
  const [pageBreak, setPageBreak] = useState<"none" | "cek" | "catat">("none");
  const [cekOpen, setCekOpen] = useState(false);
  const [catatOpen, setCatatOpen] = useState(false);

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
    documentTitle: `Document By Product - ${data?.buyer.code_document_sale}`,
    content: () => componentRef.current,
  });

  const numberToText = (num: number): string => {
    const units = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
    ];
    const teens = [
      "sepuluh",
      "sebelas",
      "dua belas",
      "tiga belas",
      "empat belas",
      "lima belas",
      "enam belas",
      "tujuh belas",
      "delapan belas",
      "sembilan belas",
    ];
    const levels = ["", "ribu", "juta", "miliar", "triliun"];

    if (num === 0) return "nol rupiah";

    let result = "";
    let level = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk) {
        const hundreds = Math.floor(chunk / 100);
        const tens = chunk % 100;
        const unitsText = hundreds
          ? hundreds === 1
            ? "seratus"
            : units[hundreds] + " ratus"
          : "";
        const tensText =
          tens < 10
            ? units[tens]
            : tens < 20
            ? teens[tens - 10]
            : units[Math.floor(tens / 10)] + " puluh " + units[tens % 10];

        result = `${unitsText} ${tensText} ${levels[level]} ${result}`.trim();
      }
      num = Math.floor(num / 1000);
      level++;
    }

    return result.trim() + " rupiah";
  };

  useEffect(() => {
    if (isModalOpen) {
      setHintOpen(true);
      setPageBreak("none");
    }
  }, [isModalOpen]);

  return (
    <Modal
      title="Export Data"
      description="Print document / Save as PDF file"
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-6xl min-h-[90vh] justify-start flex flex-col"
      rightPanel={
        <div className="flex items-center gap-3">
          <Badge className="font-normal bg-sky-200 hover:bg-sky-200 text-black rounded-full">
            {pageBreak === "none" && "Default"}
            {pageBreak === "cek" && "Pengecekan Pembelian"}
            {pageBreak === "catat" && "Catatan Pembelian"}
          </Badge>
          <Dialog modal={true} open={settingOpen} onOpenChange={setSettingOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-400/80 text-black rounded-full hover:bg-yellow-400">
                <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                Setting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Setting Print</DialogTitle>
                <DialogDescription>
                  Pilih salah satu opsi untuk <strong>Page Break</strong>{" "}
                  pencatakan dokumen
                </DialogDescription>
              </DialogHeader>
              <RadioGroup
                onValueChange={(e: "none" | "cek" | "catat") => setPageBreak(e)}
                defaultValue={pageBreak}
                className="w-full flex flex-col gap-2"
              >
                <Label
                  htmlFor={"1"}
                  className={cn(
                    "flex items-center gap-2 px-5 h-9 rounded-md hover:bg-sky-100 font-medium",
                    pageBreak === "none" && "bg-sky-100 hover:bg-sky-200"
                  )}
                >
                  <RadioGroupItem value={"none"} id="1" />
                  <p>Default</p>
                </Label>
                <Label
                  htmlFor={"2"}
                  className={cn(
                    "flex items-center gap-2 px-5 h-9 rounded-md hover:bg-sky-100 font-medium",
                    pageBreak === "cek" && "bg-sky-100 hover:bg-sky-200"
                  )}
                >
                  <RadioGroupItem value={"cek"} id="2" />
                  <p>Pengecekan Pembelian</p>
                </Label>
                <Label
                  htmlFor={"3"}
                  className={cn(
                    "flex items-center gap-2 px-5 h-9 rounded-md hover:bg-sky-100 font-medium",
                    pageBreak === "catat" && "bg-sky-100 hover:bg-sky-200"
                  )}
                >
                  <RadioGroupItem value={"catat"} id="3" />
                  <p>Catatan Pembelian</p>
                </Label>
              </RadioGroup>
              <div className="w-full flex justify-end gap-4 items-center">
                <Button
                  variant={"link"}
                  type="button"
                  onClick={() => setHintOpen(true)}
                  className="text-black/80 underline hover:text-black"
                >
                  Hints
                </Button>
                <Button type="button" onClick={() => setSettingOpen(false)}>
                  Konfirmasi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="h-[70vh] w-full flex-none justify-center flex overflow-hidden">
        <div
          className={cn(
            "justify-center flex w-full px-5",
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
              <header className="w-full flex justify-between items-center pb-3 mb-3 border-b-2 border-black">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">FORM VALIDASI</h3>
                  <p>
                    {data?.buyer.code_document_sale +
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
              </header>
              <div className="flex gap-1">
                <div className="flex flex-col font-bold">
                  <p>Cashier ID</p>
                </div>
                <div className="flex flex-col">
                  <p>: {data?.data?.transactions_today}</p>
                </div>
              </div>
              <h3 className="font-bold my-3">A. Identitas Pembeli</h3>
              <div className="w-[99.8%] flex flex-col border border-black">
                <div className="w-full flex">
                  <div className="flex w-full">
                    <p className="w-24 flex-none px-3 py-0.5 border-r border-black font-bold">
                      Nama
                    </p>
                    <p className="w-full px-3 py-0.5 border-r border-black">
                      {data?.buyer.buyer_name_document_sale}
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
                      {data?.buyer.buyer_phone_document_sale}
                    </p>
                  </div>
                  <div className="flex w-1/3 flex-none">
                    <p className="w-1/3 flex-none px-3 py-0.5 border-r border-black font-bold">
                      Tanggal
                    </p>
                    <p className="w-full px-3 py-0.5">
                      {format(
                        new Date(
                          data?.buyer.created_at ?? new Date().toString()
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
                    <p className="w-full px-3 py-0.5">
                      {data?.buyer.buyer_address_document_sale}
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
                  <div className="w-full border-r border-black px-3 py-0.5">
                    Category
                  </div>
                  <div className="w-12 flex-none border-r border-black text-center py-0.5">
                    Qty
                  </div>
                  <div className="w-36 flex-none px-3 py-0.5 border-r border-black">
                    Sebelum Diskon
                  </div>
                  <div className="w-20 flex-none border-r border-black text-center py-0.5">
                    Diskon
                  </div>
                  <div className="w-36 flex-none px-3 py-0.5">
                    Setelah Diskon
                  </div>
                </div>
                <div className="flex w-full flex-col relative">
                  {data?.data.category_report.category_list &&
                    data?.data.category_report.category_list.map(
                      (item: any) => (
                        <div
                          key={item.category}
                          className="w-full flex border-t border-black first:border-t-2"
                        >
                          <div className="w-full border-r border-black px-3 py-0.5 capitalize">
                            {item.category}
                          </div>
                          <div className="w-12 flex-none border-r border-black text-center  py-0.5">
                            {item.total_quantity}
                          </div>
                          <div className="w-36 flex-none px-3 py-0.5 border-r border-black">
                            {formatRupiah(item.before_discount) ?? "Rp 0"}
                          </div>
                          <div className="w-20 flex-none border-r border-black text-center  py-0.5">
                            {item.total_discount}%
                          </div>
                          <div className="w-36 flex-none px-3 py-0.5">
                            {formatRupiah(item.total_price) ?? "Rp 0"}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
              <div className="w-full flex items-end flex-col mt-3 font-bold">
                <div className="flex">
                  <p className="px-3">Subtotal</p>
                  <p className="w-12 flex-none text-center">
                    {data?.buyer?.total_product_document_sale}
                  </p>
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    {formatRupiah(
                      Math.ceil(data?.buyer?.total_display_document_sale)
                    ) ?? "Rp 0"}
                  </p>
                </div>
                <div className="flex">
                  <p className="px-3">
                    Kardus @
                    {formatRupiah(data?.buyer.cardbox_unit_price) ?? "Rp 0"}
                  </p>
                  <p className="w-12 flex-none text-center">
                    {data?.buyer.cardbox_qty}
                  </p>
                  <p className="w-32 flex-none pr-3 text-end tabular-nums">
                    {formatRupiah(data?.buyer.cardbox_total_price) ?? "Rp 0"}
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
                    {formatRupiah(Math.ceil(data?.buyer?.grand_total)) ??
                      "Rp 0"}
                  </p>
                </div>
              </div>
              <p className="my-3 indent-5 text-justify">
                Bahwa Buyer telah <span className="font-bold">SETUJU</span>{" "}
                dengan diskon atau harga jual yang telah ditentukan di atas dan{" "}
                <span className="font-bold">SETUJU</span> untuk melakukan
                transfer sebagaimana total{" "}
                <span className="font-bold">&quot;FINAL PRICE&quot;</span>{" "}
                tertera sebesar:
              </p>
              <div className="flex flex-col items-center my-3">
                <p className="text-lg font-bold">
                  {formatRupiah(Math.ceil(data?.buyer?.grand_total)) ?? "Rp 0"}
                </p>
                <p className="font-bold uppercase">
                  {`(${numberToText(
                    Math.ceil(data?.buyer?.grand_total) ?? 0
                  )})`}
                </p>
              </div>
              <div className="flex flex-col my-3 w-[99.8%]">
                <p>ke Rekening dibawah ini:</p>
                <div className="flex flex-col w-full border border-black mt-3">
                  <div className="flex w-full font-bold uppercase">
                    <p className="w-32 flex-none border-r border-black text-center py-0.5">
                      Bank
                    </p>
                    <p className="w-72 flex-none border-r border-black text-center py-0.5">
                      Nomor Rekening
                    </p>
                    <p className="w-full  text-center py-0.5">Nama Pemilik</p>
                  </div>
                  <div className="flex w-full border-t border-black">
                    <p className="w-32 flex-none border-r border-black text-center py-0.5">
                      BCA
                    </p>
                    <p className="w-72 flex-none border-r border-black text-center py-0.5">
                      178-499-8811
                    </p>
                    <p className="w-full text-center py-0.5">
                      PT Likuid Megah Semesta
                    </p>
                  </div>
                </div>
              </div>
              <h3
                className="font-bold my-3"
                style={{
                  pageBreakBefore: pageBreak === "cek" ? "always" : "auto",
                }}
              >
                C. Informasi Status Pembelian
              </h3>
              <div className="my-3 flex flex-col w-[99.8%] border-2 border-black">
                <div className="w-full flex font-bold">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    No
                  </div>
                  <div className="w-full text-center border-r border-black py-0.5 px-3">
                    Keterangan
                  </div>
                  <div className="w-20 flex-none text-center border-r border-black py-0.5 px-3">
                    Sudah
                  </div>
                  <div className="w-20 flex-none text-center py-0.5 px-3">
                    Belum
                  </div>
                </div>
                <div className="w-full flex border-t-2 border-black">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    1
                  </div>
                  <div className="w-full border-r border-black py-0.5 px-3">
                    Pembayaran telah dilakukan oleh buyer bersangkutan
                  </div>
                  <div className="w-20 flex-none border-r border-black py-0.5 px-3" />
                  <div className="w-20 flex-none py-0.5 px-3" />
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    2
                  </div>
                  <div className="w-full border-r border-black py-0.5 px-3">
                    Pembayaran telah terkonfirmasi masuk ke rekening yang
                    ditunjuk
                  </div>
                  <div className="w-20 flex-none border-r border-black py-0.5 px-3" />
                  <div className="w-20 flex-none py-0.5 px-3" />
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    3
                  </div>
                  <div className="w-full border-r border-black py-0.5 px-3">
                    Segala label, dan informasi pihak diluar penjual dan pembeli
                    telah di tiadakan
                  </div>
                  <div className="w-20 flex-none border-r border-black py-0.5 px-3" />
                  <div className="w-20 flex-none py-0.5 px-3" />
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    4
                  </div>
                  <div className="w-full border-r border-black py-0.5 px-3">
                    Schedule pickup barang telah di tentukan
                  </div>
                  <div className="w-20 flex-none border-r border-black py-0.5 px-3" />
                  <div className="w-20 flex-none py-0.5 px-3" />
                </div>
                <div className="w-full flex border-t border-black">
                  <div className="w-10 flex-none text-center border-r border-black py-0.5 px-3">
                    5
                  </div>
                  <div className="w-full border-r border-black py-0.5 px-3">
                    Buyer sudah di info barang keluar gudang tidak bisa di
                    kembalikan/refund
                  </div>
                  <div className="w-20 flex-none border-r border-black py-0.5 px-3" />
                  <div className="w-20 flex-none py-0.5 px-3" />
                </div>
              </div>
              <div
                className="my-3"
                style={{
                  pageBreakBefore: pageBreak === "catat" ? "always" : "auto",
                }}
              >
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
                    {data?.buyer.buyer_name_document_sale}
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
      <Dialog modal={true} open={hintOpen} onOpenChange={setHintOpen}>
        <DialogContent>
          <DialogHeader className="border-b border-black pb-5">
            <DialogTitle className="flex justify-between items-center">
              🌟 Hints & Tips
              <TooltipProviderPage value="close" side="left">
                <button
                  onClick={() => setHintOpen(false)}
                  className="w-6 h-6 flex items-center justify-center border border-black hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </TooltipProviderPage>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 text-sm">
            <ul className="list-disc pl-5 gap-2 flex flex-col text-sm leading-relaxed text-justify">
              <li>
                Sebelum mencetak dokumen harap melihat tampilan print dengan
                menekan tombol print.
              </li>
              <li>
                Jika terdapat bagian dokumen yang terpotong anda dapat kembali
                dan menyesuaikan <strong>Page Break</strong> dengan menekan
                tombol <strong>Setting</strong>.
              </li>
              <li>
                Terdapat 2 opsi: <strong>Pengecekan Pembelian</strong> dan{" "}
                <strong>Catatan Pembelian</strong> untuk{" "}
                <strong>Page Break</strong>, ada dapat memilih salah satunya.
              </li>
            </ul>
            <div className="flex flex-col gap-2 border-t border-black pt-5 mt-3">
              <p>
                Contoh opsi <strong>Page Break</strong>
              </p>
              <div className="flex gap-3 w-full">
                <Dialog modal={true} open={cekOpen} onOpenChange={setCekOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                      Pengecekan Pembelian
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader className="border-b border-black pb-5 mb-5">
                      <DialogTitle>
                        🌟 Page Break Pengecekan Pembelian
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-3 items-center">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="text-sm">
                          - Sebelum{" "}
                          <span className="font-bold bg-sky-100 px-2 py-0.5 rounded">
                            Page Break
                          </span>
                        </p>
                        <div className="w-full aspect-video relative rounded-md shadow-md border-gray-300 overflow-hidden border">
                          <Image
                            src={"/images/cek.webp"}
                            fill
                            priority
                            alt="cek-before"
                            className="object-cover place-items-center"
                          />
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow border bg-sky-100 flex-none">
                        <ArrowRight className="w-5 h--5" />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <p className="text-sm">
                          - Setelah{" "}
                          <span className="font-bold bg-sky-100 px-2 py-0.5 rounded">
                            Page Break
                          </span>
                        </p>
                        <div className="w-full aspect-video relative rounded-md shadow-md border-gray-300 overflow-hidden border">
                          <Image
                            src={"/images/pb-cek.webp"}
                            fill
                            priority
                            alt="cek-after"
                            className="object-cover place-items-center"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-5 mt-5 border-t border-black">
                      <Button
                        type="button"
                        className="text-black bg-sky-400/80 hover:bg-sky-500 hover:text-black"
                        onClick={() => setCekOpen(false)}
                      >
                        Mengerti
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  modal={true}
                  open={catatOpen}
                  onOpenChange={setCatatOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                      Catatan Pembelian
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader className="border-b border-black pb-5 mb-5">
                      <DialogTitle>🌟 Page Break Catatan Pembelian</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-3 items-center">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="text-sm">
                          - Sebelum{" "}
                          <span className="font-bold bg-sky-100 px-2 py-0.5 rounded">
                            Page Break
                          </span>
                        </p>
                        <div className="w-full aspect-video relative rounded-md shadow-md border-gray-300 overflow-hidden border">
                          <Image
                            src={"/images/catat.webp"}
                            fill
                            priority
                            alt="catat-before"
                            className="object-cover place-items-center"
                          />
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow border bg-sky-100 flex-none">
                        <ArrowRight className="w-5 h--5" />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <p className="text-sm">
                          - Setelah{" "}
                          <span className="font-bold bg-sky-100 px-2 py-0.5 rounded">
                            Page Break
                          </span>
                        </p>
                        <div className="w-full aspect-video relative rounded-md shadow-md border-gray-300 overflow-hidden border">
                          <Image
                            src={"/images/pb-catat.webp"}
                            fill
                            priority
                            alt="catat-after"
                            className="object-cover place-items-center"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-5 mt-5 border-t border-black">
                      <Button
                        type="button"
                        className="text-black bg-sky-400/80 hover:bg-sky-500 hover:text-black"
                        onClick={() => setCatatOpen(false)}
                      >
                        Mengerti
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Modal>
  );
};
