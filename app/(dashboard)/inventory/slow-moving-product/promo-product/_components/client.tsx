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
import {
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  PlusCircle,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Pagination from "@/components/pagination";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";

export const Client = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  const [data, setData] = useState<any[]>([]);

  const handleGetData = async (p?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/promo?page=${p ?? page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setData(dataRes.data);
      setPage({
        current: dataRes.current_page ?? 1,
        last: dataRes.last_page ?? 1,
        from: dataRes.from ?? 0,
        total: dataRes.total ?? 0,
        perPage: dataRes.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };

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
          url: "/inventory/slow-moving-product/promo-product",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  // effect search & page data
  useEffect(() => {
    handleCurrentId(searchValue);
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageListProductMV")) {
      handleCurrentId(searchValue);
      handleGetData();
      return cookies.remove("pageListProductMV");
    }
  }, [cookies.get("pageListProductMV"), page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("listProductMV")) {
      handleGetData();
      return cookies.remove("listProductMV");
    }
  }, [cookies.get("listProductMV")]);

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
          <BreadcrumbItem>Slow Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>List Promo Products</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Promo Products</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex gap-4 items-center">
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("listProductMV", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                  variant={"outline"}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
              <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Promo
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="min-w-44 w-full max-w-[250px]">Promo Name</p>
                <p className="w-36 flex-none">Barcode Product</p>
                <p className="min-w-72 w-full max-w-[500px]">Name Product</p>
                <p className="w-40 flex-none">Category</p>
                <p className="w-16 flex-none">Qty</p>
                <p className="w-44 flex-none">Price</p>
                <p className="w-44 flex-none">Promo Price</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-36 text-center flex-none">Action</p>
              </div>

              {loading ? (
                <div className="w-full min-h-[300px]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="h-4 w-7" />
                      </div>
                      <div className="min-w-44 w-full max-w-[250px]">
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="min-w-72 w-full max-w-[500px]">
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <div className="w-40 flex-none">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="w-16 flex-none">
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="w-36 flex-none flex gap-4 justify-center">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={i}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <TooltipProviderPage
                          value={<p className="w-44">{item.name_promo}</p>}
                        >
                          <p className="min-w-44 w-full max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.name_promo}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-36 flex-none">
                          {item.new_product.new_barcode_product ??
                            item.new_product.old_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">
                              {item.new_product.new_name_product}
                            </p>
                          }
                        >
                          <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.new_product.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <TooltipProviderPage
                          value={
                            <p className="w-40">
                              {item.new_product.new_category_product ??
                                item.new_product.new_tag_product}
                            </p>
                          }
                        >
                          <p className="w-40 flex-none text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.new_product.new_category_product ??
                              item.new_product.new_tag_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-16 flex-none">
                          {item.new_product.new_quantity_product}
                        </p>
                        <p className="w-44 flex-none">
                          {formatRupiah(item.new_product.display_price) ??
                            "Rp 0"}
                        </p>
                        <p className="w-44 flex-none">
                          {formatRupiah(item.price_promo) ?? "Rp 0"}
                        </p>
                        <div className="w-28 flex-none">
                          <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-sky-300 hover:bg-sky-300">
                            {item.new_product.new_status_product}
                          </Badge>
                        </div>
                        <div className="w-36 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            type="button"
                            onClick={() => alert("pop up")}
                          >
                            <ReceiptText className="w-4 h-4 mr-1" />
                            <p>Detail</p>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Grid2x2X className="w-8 h-8" />
                        <p className="text-sm font-semibold">No Data Viewed.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Pagination
            pagination={page}
            setPagination={setPage}
            cookie="pageListProductMV"
          />
        </div>
      </div>
    </div>
  );
};
