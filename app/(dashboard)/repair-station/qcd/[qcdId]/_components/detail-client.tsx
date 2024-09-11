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
  PackageOpen,
  PlusCircle,
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
          <BreadcrumbItem>Repair Station</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/repair-station/qcd">QCD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/repair-station/qcd">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail QCD</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <h5 className="font-medium">LQB075831</h5>
            <h3 className="text-xl font-semibold capitalize">bundle dong</h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Total Price</p>
            <p className="font-medium text-sm">{formatRupiah(25000000)}</p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Custom Display</p>
            <p className="font-medium text-sm">{formatRupiah(25000000)}</p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <Button className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700">
            <Barcode className="w-4 h-4 mr-1" />
            Barcode
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in QCD
          </h2>
          <div className="flex gap-4">
            <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
              <FileDown className="w-4 h-4 mr-1" />
              Export Data
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-36 flex-none">Code Document</p>
                <p className="w-32 flex-none">Barcode</p>
                <p className="w-40 flex-none">Category</p>
                <p className="w-64 flex-none">Product Name</p>
                <p className="w-40 flex-none">Price</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-28 text-center flex-none">Action</p>
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <p className="w-10 text-center flex-none">{i + 1}</p>
                  <p className="w-36 flex-none overflow-hidden text-ellipsis">
                    0252/08/2024
                  </p>
                  <p className="w-32 flex-none whitespace-pre-wrap">
                    1006000469
                  </p>
                  <p className="w-40 flex-none whitespace-pre-wrap">
                    ELEKTRONIK ART
                  </p>
                  <p className="w-64 flex-none whitespace-pre-wrap">
                    kamera canon
                  </p>
                  <div className="w-40 flex-none">
                    {formatRupiah(5500000000)}
                  </div>
                  <div className="w-28 flex-none">
                    <Badge className="bg-sky-300 hover:bg-sky-300 text-black">
                      Bundle
                    </Badge>
                  </div>
                  <div className="w-28 flex-none flex gap-4 justify-center">
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
