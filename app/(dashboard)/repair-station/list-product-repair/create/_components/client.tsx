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
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "../loading";

const Client = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }
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
            <BreadcrumbLink href="/repair-station/list-product-repair">
              List Product Repair
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/repair-station/list-product-repair">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create List Product Repair</h1>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-1/4 flex flex-col">
          <form className="flex h-[425px] flex-col w-full gap-4 bg-white p-5 rounded-md shadow">
            <div className="w-full py-1 mb-2 border-b border-gray-500 text-xl font-semibold">
              <h3>Data List Product Repair</h3>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Repair Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Repair name..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Total Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Rp. 0,00"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Custom Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="0,00"
                type="number"
              />
            </div>
            <Button className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto">
              Create
            </Button>
          </form>
        </div>
        <div className="w-3/4 flex flex-col h-[425px] bg-white rounded-md shadow overflow-hidden p-5">
          <div className="w-full py-1 mb-6 border-b border-gray-500 text-xl font-semibold">
            <h3>Product Filtered</h3>
          </div>
          <div className="flex flex-col w-full gap-4">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-32 flex-none">Barcode</p>
              <p className="w-full">Product Name</p>
              <p className="w-24 text-center flex-none">Action</p>
            </div>
            <ScrollArea className="w-full h-[212px]">
              <div className="w-full">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    className="flex w-full px-5 py-2 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    key={i}
                  >
                    <p className="w-10 text-center flex-none">{i + 1}</p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      LQB075831
                    </p>
                    <p className="w-full whitespace-pre-wrap">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                    <div className="w-24 flex-none flex gap-4 justify-center">
                      <Button
                        className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                        variant={"outline"}
                        type="button"
                        onClick={() => alert("pop up")}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <div>Delete</div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center">
          <h3 className="border-b border-gray-500 pr-10 pb-1">List Products</h3>
          <div className="relative flex w-1/4 items-center">
            <Input
              className="border-sky-400/80 focus-visible:ring-sky-400 w-full pl-10"
              placeholder="Search product..."
            />
            <Label className="absolute left-3">
              <Search className="w-5 h-5" />
            </Label>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full">Product Name</p>
            <p className="w-44 flex-none">Category</p>
            <p className="w-32 flex-none">Price</p>
            <p className="w-24 text-center flex-none">Action</p>
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
                <p className="w-44 flex-none">ELEKTRONIK ART</p>
                <p className="w-32 flex-none">{formatRupiah(5500000)}</p>
                <div className="w-24 flex-none flex gap-4 justify-center">
                  <Button
                    className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                    variant={"outline"}
                    type="button"
                    onClick={() => alert("pop up")}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    <div>Add</div>
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

export default Client;
