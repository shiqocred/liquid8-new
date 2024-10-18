"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { baseUrl } from "@/lib/baseUrl";
import { useModal } from "@/hooks/use-modal";
import { cn, formatRupiah } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

import {
  Trash2,
  Grid2x2X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Loading from "../loading";

export const Client = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // state search & page
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any[]>([]);

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/product_scans?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle search params
  const handleCurrentId = useCallback(
    (q: string, p: number) => {
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        page: p,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!p || p <= 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: `/inbound/check-product/scan-result`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  // handle auto update
  useEffect(() => {
    if (cookies.get("scanResult")) {
      handleGetData();
      return cookies.remove("scanResult");
    }
  }, [cookies.get("scanResult")]);

  useEffect(() => {
    handleCurrentId(searchValue, page.current);
    handleGetData();
  }, [searchValue, page.current]);

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
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
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Check Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Scan Result</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product Scan</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full flex-auto">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("scanResult", "update");
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
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-3 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                <p className="w-52 flex-none">Price</p>
                <p className="w-52 flex-none">User</p>
                <p className="w-24 flex-none text-center">Action</p>
              </div>
              {loading ? (
                <div className="w-full h-full">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-full px-5 py-5 text-sm gap-3 border-b border-sky-200 items-center hover:border-sky-300"
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-full min-w-72 max-w-[500px] ">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-52 flex-none">
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <div className="w-52 flex-none">
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <div className="w-24 flex-none flex gap-4 justify-center">
                        <Skeleton className="w-9 h-4" />
                        <Skeleton className="w-9 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-3 text-sm gap-3 border-b border-sky-200 items-center hover:border-sky-300"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.product_name}
                        </p>
                        <p className="w-52 flex-none overflow-hidden text-ellipsis">
                          {formatRupiah(parseFloat(item.product_price))}
                        </p>
                        <p className="w-52 flex-none overflow-hidden text-ellipsis">
                          {item.user.username}
                        </p>
                        <div className="w-24 flex-none flex gap-4 justify-center">
                          <TooltipProviderPage value="Check">
                            <Link
                              href={`/inbound/check-product/scan-result/${item.id}`}
                              className="w-9"
                            >
                              <Button
                                className="items-center w-full px-0  border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                                variant={"outline"}
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipProviderPage>
                          <TooltipProviderPage value="Delete">
                            <Button
                              className="items-center px-0  border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 w-9"
                              variant={"outline"}
                              type="button"
                              onClick={() =>
                                onOpen("delete-scan-result", item.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipProviderPage>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
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
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                Total: {page.total}
              </Badge>
              <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                Row per page: {page.perPage}
              </Badge>
            </div>
            <div className="flex gap-5 items-center">
              <p className="text-sm">
                Page {page.current} of {page.last}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() =>
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
                  }
                  disabled={page.current === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() =>
                    setPage((prev) => ({ ...prev, current: prev.current + 1 }))
                  }
                  disabled={page.current === page.last}
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
