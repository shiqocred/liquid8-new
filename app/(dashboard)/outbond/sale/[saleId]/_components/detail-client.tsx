"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ArrowLeft,
  Barcode,
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Edit2,
  FileDown,
  FolderDown,
  PackageOpen,
  PlusCircle,
  Printer,
  ReceiptText,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DetailClient = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Outbond</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/outbond/sale">Sale</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/sale">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail Sale</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4">
              <h5 className="font-medium">LQDSLE00244</h5>
              <Badge className="bg-sky-300 hover:bg-sky-300 text-xs font-normal text-black rounded-full py-0.5 capitalize">
                4 Products
              </Badge>
            </div>
            <h3 className="text-xl font-semibold uppercase">inka</h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Voucher</p>
            <p className="font-medium text-sm">-</p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Total Price</p>
            <p className="font-medium text-sm">{formatRupiah(25000000)}</p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <Button className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700">
            <Printer className="w-4 h-4 mr-2" />
            Export By Product
          </Button>
          <Button className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700">
            <FileDown className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in Sale
          </h2>
          <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Products
          </Button>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode</p>
                <p className="min-w-60 w-full ">Product Name</p>
                <p className="w-20 flex-none">Qty</p>
                <p className="w-40 flex-none">Price</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-52 text-center flex-none">Action</p>
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <p className="w-10 text-center flex-none">{i + 1}</p>
                  <p className="w-32 flex-none whitespace-pre-wrap">
                    1006000469
                  </p>
                  <p className="min-w-60 w-full whitespace-pre-wrap">
                    kamera canon
                  </p>
                  <p className="w-20 flex-none whitespace-pre-wrap">1</p>
                  <div className="w-40 flex-none">
                    {formatRupiah(5500000000)}
                  </div>
                  <div className="w-28 flex-none">
                    <Badge className="bg-sky-300 hover:bg-sky-300 text-black font-normal">
                      Selesai
                    </Badge>
                  </div>
                  <div className="w-52 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center border-yellow-700 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <div>Edit</div>
                    </Button>
                    <Button
                      className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <div>Remove</div>
                    </Button>
                  </div>
                </div>
              ))}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">Page {page} of 3</p>
            <div className="flex items-center gap-2">
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClient;
