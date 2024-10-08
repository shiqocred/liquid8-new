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
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading";

interface Category {
  id: string;
  new_barcode_product: string;
  new_name_product: string;
  new_category_product: string;
  new_price_product: string;
  new_status_product: "display";
  display_price: string;
  created_at: string;
  new_date_in_product: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleCurrentId = useCallback(
    (q: string) => {
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }

      const url = qs.stringifyUrl(
        {
          url: `/inbound/check-product/approve-scan-result`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Scan Result</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Approvement</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Scan Result Approvement</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="flex items-center gap-3 w-2/5">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <div className="h-9 px-4 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                Total:
                <span className="font-semibold">50 Products</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Done Check All
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-28 flex-none">Barcode</p>
                <p className="min-w-72 w-full max-w-[500px]">Product Name</p>
                <p className="w-44 flex-none">Category</p>
                <p className="w-44 flex-none">Price</p>
                <p className="w-60 flex-none">Date</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-48 text-center flex-none">Action</p>
              </div>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <p className="w-10 text-center flex-none">{i + 1}</p>
                  <p className="w-28 flex-none overflow-hidden text-ellipsis">
                    175L24145
                  </p>
                  <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap">
                    OLEVS Jam Tangan Pria Anti Air Original 100% Keren Led
                    Terbaru Stainless Steel Causal Luxury Quartz Kronograf
                  </p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    BABY PRODUCT
                  </p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    {formatRupiah(100000)}
                  </p>
                  <p className="w-60 flex-none whitespace-pre-wrap">
                    {format(new Date(1 - 10 - 2024), "iiii, dd MMMM yyyy")}
                  </p>
                  <div className="w-28 flex-none">
                    <Badge
                      className={cn(
                        "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400"
                      )}
                    >
                      Display
                    </Badge>
                  </div>
                  <div className="w-48 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <ReceiptText className="w-4 h-4 mr-1" />
                      <p>Detail</p>
                    </Button>
                    <Button
                      className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
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
