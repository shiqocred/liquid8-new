"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeDollarSign,
  BadgePercent,
  Barcode,
  BriefcaseBusiness,
  ChevronDown,
  ChevronDownCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Edit3,
  MapPinned,
  MoreHorizontal,
  PlusCircle,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

const CreateClient = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "loading...";
  }
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
          <BreadcrumbItem>Cashier</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/sale">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Cashier</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <div className="flex w-full border-b border-gray-500">
              <div className="flex gap-4 items-center w-full px-5 py-3 flex-1 border-r border-gray-500">
                <TooltipProviderPage value={<p>Barcode Sale</p>}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                    <Barcode className="w-5 h-5" />
                  </div>
                </TooltipProviderPage>
                <TooltipProviderPage value={<p>Barcode Sale</p>}>
                  <h3 className="text-xl font-semibold capitalize">
                    LQDSLE00246
                  </h3>
                </TooltipProviderPage>
              </div>
              <div className="flex gap-4 items-center w-full px-5 py-3 flex-1">
                <div className="w-full flex items-center gap-4">
                  <TooltipProviderPage value={<p>Buyer Name</p>}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                      <BriefcaseBusiness className="w-5 h-5" />
                    </div>
                  </TooltipProviderPage>
                  <TooltipProviderPage value={<p>Buyer Name</p>}>
                    <h3 className="text-xl font-semibold capitalize">
                      QAEDY KARAMY
                    </h3>
                  </TooltipProviderPage>
                </div>
                <TooltipProviderPage value={<p>Change Buyer</p>}>
                  <Button className="ml-5 w-10 h-10 flex-none p-0 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:border-yellow-700 hover:text-yellow-700">
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </TooltipProviderPage>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex gap-4 items-center w-full px-5 py-3 flex-1">
                <TooltipProviderPage value={<p>Total Price</p>}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                    <BadgeDollarSign className="w-5 h-5" />
                  </div>
                </TooltipProviderPage>
                <TooltipProviderPage value={<p>Total Price</p>}>
                  <h3 className="text-xl font-semibold capitalize">
                    {formatRupiah(5525000)}
                  </h3>
                </TooltipProviderPage>
              </div>
              <div className="flex gap-4 items-center w-full px-5 py-3 flex-1 border-l border-gray-500">
                <div className="w-full flex items-center gap-4">
                  <TooltipProviderPage value={<p>Voucher Amount</p>}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                      <BadgePercent className="w-5 h-5" />
                    </div>
                  </TooltipProviderPage>
                  <TooltipProviderPage value={<p>Voucher Amount</p>}>
                    <div className="flex gap-4 items-center">
                      <h3 className="text-xl font-semibold capitalize">
                        {formatRupiah(5525000)}
                      </h3>
                      <Badge className="bg-black hover:bg-black text-white text-xs rounded-full">
                        Voucher
                      </Badge>
                    </div>
                  </TooltipProviderPage>
                </div>
                <TooltipProviderPage value={<p>Edit Voucher</p>}>
                  <Button className="ml-5 w-10 h-10 flex-none p-0 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:border-yellow-700 hover:text-yellow-700">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </TooltipProviderPage>
              </div>
            </div>
          </div>
          <Button className="ml-6 rounded h-32 w-32 flex-none bg-transparent border text-xl border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700">
            <Send className="w-6 h-6 mr-3" />
            Send
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 flex justify-between items-center relative">
          <Label
            htmlFor="search"
            className="flex gap-2 absolute left-2 items-center"
          >
            <Badge className="bg-black text-xs hover:bg-black rounded-full text-white">
              Add Product
            </Badge>
          </Label>
          <Input
            id="search"
            className="rounded-r-none pl-28 focus-visible:ring-0 focus-visible:border focus-visible:border-sky-300 border-sky-300/80"
          />
          <Button className="bg-sky-300/80 w-10 p-0 hover:bg-sky-300 text-black rounded-l-none border border-sky-300/80 hover:border-sky-300">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full p-4 rounded-md border border-sky-400/80">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full min-w-72">Product Name</p>
            <p className="w-44 flex-none">Price</p>
            <p className="w-52 text-center flex-none">Action</p>
          </div>
          <div className="w-full">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <p className="w-32 flex-none overflow-hidden text-ellipsis">
                  LQB075831
                </p>
                <p className="w-full min-w-72 whitespace-pre-wrap">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <p className="w-44 flex-none">{formatRupiah(550000000)}</p>
                <div className="w-52 flex-none flex gap-4 justify-center">
                  <Button
                    className="items-center border-yellow-700 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-100"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
