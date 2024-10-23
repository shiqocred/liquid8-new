"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  ArrowRightCircle,
  ArrowUpRight,
  ArrowUpRightFromSquare,
  Bomb,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRupiah } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateClient = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
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
            <BreadcrumbLink href="/repair-station/qcd">QCD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/repair-station/qcd">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create QCD List</h1>
      </div>
      <div className="w-full flex flex-col">
        <form className="flex flex-col w-full gap-4 bg-white p-5 rounded-md shadow">
          <div className="w-full pb-1 mb-2 border-b border-gray-500 text-xl font-semibold">
            <h3>Data QCD</h3>
          </div>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <Label>QCD Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500"
                placeholder="Repair name..."
              />
            </div>
            <div className="flex flex-col gap-1 w-1/4">
              <Label>Total Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="Rp. 0,00"
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 w-1/4">
              <Label>Custom Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500"
                placeholder="0,00"
                type="number"
              />
            </div>
            <Button
              type="submit"
              className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center gap-4">
          <h3 className="border-b border-gray-500 pr-10 pb-1 w-fit">
            List Products Filtered
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                Add Product
                <ArrowUpRightFromSquare className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[75vw] w-full flex flex-col">
              <DialogHeader>
                <DialogTitle>List Product</DialogTitle>
              </DialogHeader>
              <div className="w-full flex flex-col gap-5 mt-5 text-sm">
                <div className="flex gap-4 items-center w-full">
                  <div className="relative flex w-1/3 items-center">
                    <Input
                      className="border-sky-400/80 focus-visible:ring-sky-400 w-full pl-10"
                      placeholder="Search product..."
                    />
                    <Label className="absolute left-3">
                      <Search className="w-5 h-5" />
                    </Label>
                  </div>
                  <TooltipProviderPage value={"Reload Data"}>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                      variant={"outline"}
                    >
                      <RefreshCw
                        className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                      />
                    </Button>
                  </TooltipProviderPage>
                </div>
                <div className="w-full p-4 rounded-md border border-sky-400/80 h-full">
                  <ScrollArea className="w-full ">
                    <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                      <p className="w-10 text-center flex-none">No</p>
                      <p className="w-32 flex-none">Barcode</p>
                      <p className="w-full min-w-72 max-w-[500px]">
                        Product Name
                      </p>
                      <p className="w-44 flex-none">Category</p>
                      <p className="w-32 flex-none">Price</p>
                      <p className="w-56 text-center flex-none">Action</p>
                    </div>
                    {loadingFiltered ? (
                      <div className="w-full h-[64vh]">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                          >
                            <div className="w-10 flex justify-center flex-none">
                              <Skeleton className="w-7 h-4" />
                            </div>
                            <div className="w-32 flex-none">
                              <Skeleton className="w-24 h-4" />
                            </div>
                            <div className="w-full min-w-44 max-w-[400px]">
                              <Skeleton className="w-32 h-4" />
                            </div>
                            <div className="w-14 flex-none flex gap-4 justify-center">
                              <Skeleton className="w-9 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="h-[50vh]">
                        {
                          // filtered.length > 0 ? (
                          Array.from({ length: 20 }, (_, i) => (
                            <div
                              className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                              key={i}
                            >
                              <p className="w-10 text-center flex-none">
                                {i + 1}
                              </p>
                              <p className="w-32 flex-none overflow-hidden text-ellipsis">
                                LQB075831
                              </p>
                              <TooltipProviderPage
                                value={
                                  <p className="w-auto max-w-72 ">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.
                                  </p>
                                }
                              >
                                <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit.
                                </p>
                              </TooltipProviderPage>
                              <p className="w-44 flex-none">ELEKTRONIK ART</p>
                              <p className="w-32 flex-none">
                                {formatRupiah(5500000)}
                              </p>
                              <div className="w-56 flex-none flex gap-4 justify-center">
                                <Button
                                  className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                                  variant={"outline"}
                                  type="button"
                                  onClick={() => alert("pop up")}
                                >
                                  <PlusCircle className="w-4 h-4 mr-1" />
                                  <div>Add</div>
                                </Button>
                                <Button
                                  className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                                  variant={"outline"}
                                  type="button"
                                  onClick={() => alert("pop up")}
                                >
                                  <Bomb className="w-4 h-4 mr-1" />
                                  <div>To Scrap</div>
                                </Button>
                              </div>
                            </div>
                          ))

                          // ) : (
                          // <div className="h-[300px] flex items-center justify-center">
                          //   <div className="flex flex-col items-center gap-2 text-gray-500">
                          //     <Grid2x2X className="w-8 h-8" />
                          //     <p className="text-sm font-semibold">
                          //       No Data Viewed.
                          //     </p>
                          //   </div>
                          // </div>
                          // )
                        }
                      </ScrollArea>
                    )}
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                      Total: 0
                    </Badge>
                    <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                      Row per page: 0
                    </Badge>
                  </div>
                  <div className="flex gap-5 items-center">
                    <p className="text-sm">Page 0 of 0</p>
                    <div className="flex items-center gap-2">
                      <Button
                        className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                        // onClick={() => {
                        //   setPageFiltered((prev) => ({
                        //     ...prev,
                        //     current: prev.current - 1,
                        //   }));
                        // }}
                        // disabled={pageFiltered.current === 1}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                        // onClick={() => {
                        //   setPageFiltered((prev) => ({
                        //     ...prev,
                        //     current: prev.current + 1,
                        //   }));
                        // }}
                        // disabled={pageFiltered.current === pageFiltered.last}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full min-w-96 max-w-[800px]">Product Name</p>
            <p className="w-24 text-center flex-none ml-auto">Action</p>
          </div>

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
                <TooltipProviderPage
                  value={
                    <p className="w-auto max-w-72 ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  }
                >
                  <p className="w-full min-w-96 max-w-[800px] whitespace-nowrap text-ellipsis overflow-hidden">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </TooltipProviderPage>
                <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
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
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                Total: 0
              </Badge>
              <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                Row per page: 0
              </Badge>
            </div>
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
