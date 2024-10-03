"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatRupiah } from "@/lib/utils";
import { useEffect, useState } from "react";
import Loading from "../loading";

export const Client = () => {
  const [isMounted, setIsMounted] = useState(false);

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
          <BreadcrumbItem>Product by Color</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product by Color</h2>
        <div className="grid grid-cols-2 xl:grid-cols-3 w-full gap-6">
          <div className="bg-white rounded-md w-full border shadow col-span-1 px-6 py-3 flex flex-col gap-3 relative">
            <div className="absolute left-0 w-2 h-4/5 bg-yellow-800 rounded-r" />
            <div className="absolute right-0 w-2 h-4/5 bg-yellow-800 rounded-l" />
            <div className="flex flex-col">
              <h5>Brown</h5>
              <div className="flex items-center gap-2 text-xs text-black/50">
                <p>{formatRupiah(50000)}</p>
                <p>-</p>
                <p>{formatRupiah(99999)}</p>
              </div>
            </div>
            <div className="flex justify-end text-3xl font-semibold">
              {(3500).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-md w-full border shadow col-span-1 px-6 py-3 flex flex-col gap-3 relative">
            <div className="absolute left-0 w-2 h-4/5 bg-green-400 rounded-r" />
            <div className="absolute right-0 w-2 h-4/5 bg-green-400 rounded-l" />
            <div className="flex flex-col">
              <h5>Green</h5>
              <div className="flex items-center gap-2 text-xs text-black/50">
                <p>{formatRupiah(50000)}</p>
                <p>-</p>
                <p>{formatRupiah(99999)}</p>
              </div>
            </div>
            <div className="flex justify-end text-3xl font-semibold">
              {(3500).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-md w-full border shadow col-span-1 px-6 py-3 flex flex-col gap-3 relative">
            <div className="absolute left-0 w-2 h-4/5 bg-sky-500 rounded-r" />
            <div className="absolute right-0 w-2 h-4/5 bg-sky-500 rounded-l" />
            <div className="flex flex-col">
              <h5>Blue</h5>
              <div className="flex items-center gap-2 text-xs text-black/50">
                <p>{formatRupiah(50000)}</p>
                <p>-</p>
                <p>{formatRupiah(99999)}</p>
              </div>
            </div>
            <div className="flex justify-end text-3xl font-semibold">
              {(3500).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
