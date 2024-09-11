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
  Barcode,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MapPinned,
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
            <BreadcrumbLink href="/outbond/migrate">Migrate</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>New</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/migrate">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">New Migrate</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex items-center w-full gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
              <MapPinned className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold capitalize">DISKONTER</h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <Button className="ml-5 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:border-yellow-700 hover:text-yellow-700">
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Change Destination
          </Button>
          <Button className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700">
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center">
          <h3 className="border-b border-gray-500 pr-10 pb-1">List Products</h3>
          <Button className="bg-sky-300/80 hover:bg-sky-300 text-black">
            <PlusCircle className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full">Color</p>
            <p className="w-24 flex-none">Total</p>
            <p className="w-28 flex-none">Status</p>
            <p className="w-32 text-center flex-none">Action</p>
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
                <p className="w-full whitespace-pre-wrap">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <p className="w-24 flex-none">{(2551).toLocaleString()}</p>
                <p className="w-28 flex-none">
                  <Badge className="bg-gray-300 hover:bg-gray-300 text-black">
                    Proses
                  </Badge>
                </p>
                <div className="w-32 flex-none flex gap-4 justify-center">
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
          <div className="w-full flex justify-between items-center">
            <p className="text-sm">Total Product: 20</p>
            <div className="flex gap-5 items-center">
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
    </div>
  );
};

export default CreateClient;
