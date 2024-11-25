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
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Grid2x2X,
  PackageOpen,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
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
        `${baseUrl}/palet?page=${p ?? page.current}&q=${searchValue}`,
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
          url: "/inventory/pallet/list",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  // effect search & page data
  useEffect(() => {
    handleCurrentId(searchValue);
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageBKLList")) {
      handleCurrentId(searchValue);
      handleGetData();
      return cookies.remove("pageBKLList");
    }
  }, [cookies.get("pageBKLList"), page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("listBKL")) {
      handleGetData();
      return cookies.remove("listBKL");
    }
  }, [cookies.get("listBKL")]);

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
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Pallet</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Pallet</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex gap-4">
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("listBKL", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                  variant={"outline"}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
              <Link href="/inventory/pallet/list/create">
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Pallet
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode Pallet</p>
                <p className="w-full min-w-72 max-w-[450px]">Pallet Name</p>
                <p className="w-44 flex-none">Category</p>
                <p className="w-44 flex-none">Total Price</p>
                <p className="w-20 flex-none">Qty</p>
                <p className="w-52 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="w-full min-w-72 max-w-[450px]">
                        <Skeleton className="w-72 h-4" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="w-36 h-4" />
                      </div>
                      <div className="w-44 flex-none ">
                        <Skeleton className="w-36 h-4" />
                      </div>
                      <div className="w-20 flex-none">
                        <Skeleton className="w-12 h-4" />
                      </div>
                      <div className="w-52 flex-none flex gap-4 justify-center">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <p className="w-32 flex-none overflow-hidden text-ellipsis">
                          {item.palet_barcode}
                        </p>
                        <TooltipProviderPage
                          value={<p className="max-w-72">{item.name_palet}</p>}
                        >
                          <p className="w-full min-w-72 max-w-[450px] whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.name_palet}
                          </p>
                        </TooltipProviderPage>
                        <TooltipProviderPage value={item.category_palet}>
                          <p className="w-44 flex-none whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.category_palet}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-44 flex-none ">
                          {formatRupiah(item.total_price_palet) ?? "Rp 0"}
                        </p>
                        <div className="w-20 flex-none">
                          {item.total_product_palet}
                        </div>
                        <div className="w-52 flex-none flex gap-4 justify-center">
                          <Link href={`/inventory/pallet/list/${i + 1}`}>
                            <Button
                              className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                              variant={"outline"}
                              type="button"
                            >
                              <ReceiptText className="w-4 h-4 mr-1" />
                              <p>Detail</p>
                            </Button>
                          </Link>
                          <Button
                            className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={() => alert("pop up")}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <p>Delete</p>
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
            cookie="pageBKLList"
          />
        </div>
      </div>
    </div>
  );
};
