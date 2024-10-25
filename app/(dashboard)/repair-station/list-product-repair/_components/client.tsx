"use client";

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
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  Loader2,
  PlusCircle,
  Recycle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { Badge } from "@/components/ui/badge";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useModal } from "@/hooks/use-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { onOpen } = useModal();

  // state bool
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // state search & page
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  const findNotNull = (v: any) => {
    const qualityObject = JSON.parse(v);

    const filteredEntries = Object.entries(qualityObject).find(
      ([key, value]) => value !== null
    );

    return {
      key: filteredEntries?.[0] ?? "",
      value: filteredEntries?.[1] ?? "",
    };
  };

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any[]>([]);

  // handle GET Data
  const handleGetData = async (p?: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/repair?page=${p ?? page.current}&q=${searchValue}`,
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
  const handleGetDetail = async (
    e: MouseEvent,
    documentCode: any,
    barcode: any
  ) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(
        `${baseUrl}/getProductRepair?code_document=${documentCode}&old_barcode_product=${barcode}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Data successfully founded.");
      onOpen("to-display-lpr-modal", response.data.data.resource.product);
    } catch (err: any) {
      toast.error("Data failed to found.");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

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
          url: "/repair-station/list-product-repair",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  // update search & page
  useEffect(() => {
    handleCurrentId(searchValue, 1);
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageLPR")) {
      handleCurrentId(searchValue, page.current);
      handleGetData();
      return cookies.remove("pageLPR");
    }
  }, [cookies.get("pageLPR"), searchValue, page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("LPRPage")) {
      handleGetData();
      return cookies.remove("LPRPage");
    }
  }, [cookies.get("LPRPage")]);

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
          <BreadcrumbItem>Repair Station</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>List Product Repair</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product Repair</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="w-full flex gap-4">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("LPRPage", "update");
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
            <Link href="/repair-station/list-product-repair/create">
              <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create
              </Button>
            </Link>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                <p className="w-64 flex-none">Keterangan</p>
                <p className="w-60 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="w-full min-w-72 max-w-[500px]">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-64 flex-none">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-60 flex-none flex gap-4 justify-center">
                        <Skeleton className="w-28 h-4" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={i}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <TooltipProviderPage value={item.old_barcode_product}>
                          <p className="w-32 flex-none overflow-hidden text-ellipsis">
                            {item.old_barcode_product}
                          </p>
                        </TooltipProviderPage>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">{item.new_name_product}</p>
                          }
                        >
                          <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-64 flex-none whitespace-nowrap text-ellipsis overflow-hidden">
                          <span className="font-bold">
                            {"[" +
                              (findNotNull(item.new_quality).key === "damaged"
                                ? "DMG"
                                : "ABL") +
                              "] "}
                          </span>
                          {`- ${findNotNull(item.new_quality).value}`}
                        </p>
                        <div className="w-60 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) =>
                              handleGetDetail(
                                e,
                                item.code_document,
                                item.old_barcode_product
                              )
                            }
                            disabled={loadingDetail}
                          >
                            {loadingDetail ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 mr-1" />
                            )}
                            <p>To Display</p>
                          </Button>
                          <Button
                            className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={() => onOpen("qcd-lpr-modal", item.id)}
                          >
                            <Recycle className="w-4 h-4 mr-1" />
                            <p>QCD</p>
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
                  onClick={() => {
                    setPage((prev) => ({
                      ...prev,
                      current: prev.current - 1,
                    }));
                    cookies.set("pageLPR", "removed");
                  }}
                  disabled={page.current === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() => {
                    setPage((prev) => ({
                      ...prev,
                      current: prev.current + 1,
                    }));
                    cookies.set("pageLPR", "added");
                  }}
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
