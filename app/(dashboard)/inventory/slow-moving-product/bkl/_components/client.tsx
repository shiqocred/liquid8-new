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
  Percent,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Pagination from "@/components/pagination";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { Separator } from "@/components/ui/separator";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const { onOpen } = useModal();

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
  const [bkl, setBkl] = useState<any>();

  const handleGetData = async (p?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/bkls?page=${p ?? page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setData(dataRes.products.data);
      setBkl(dataRes);
      setPage({
        current: dataRes.products.current_page ?? 1,
        last: dataRes.products.last_page ?? 1,
        from: dataRes.products.from ?? 0,
        total: dataRes.products.total ?? 0,
        perPage: dataRes.products.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetail = async (e: MouseEvent, idItem: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/promo/${idItem}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully found");
      const dataRes = response.data.data.resource;
      onOpen("detail-promo-modal", dataRes);
    } catch (err: any) {
      toast.success("Data failed to be found");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
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
          url: "/inventory/slow-moving-product/bkl",
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
          <BreadcrumbItem>Slow Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>BKL</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List BKL</h2>
        <div className="flex w-full gap-4 p-4 border border-sky-400/80 rounded-md">
          <div className="flex w-1/3 flex-col">
            <p className="text-sm underline underline-offset-2">Total BKL</p>
            <p className="text-3xl font-semibold">{data.length}</p>
          </div>
          <div className="flex w-2/3 flex-col border-l pl-4 border-sky-400">
            <p className="text-sm underline underline-offset-2">
              Total Price BKL
            </p>
            <p className="text-3xl font-semibold">
              {formatRupiah(bkl?.tota_price ?? 0) ?? "Rp 0"}
            </p>
          </div>
        </div>
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
              <Button
                asChild
                className="bg-sky-400/80 hover:bg-sky-400 text-black"
              >
                <Link href={"/inventory/slow-moving-product/bkl/create"}>
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add BKL
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-36 flex-none">Old Barcode</p>
                <p className="w-36 flex-none">New Barcode</p>
                <p className="min-w-72 w-full max-w-[500px]">Name Product</p>
                <p className="w-36 flex-none">Old Price</p>
                <p className="w-36 flex-none">New Price</p>
                <p className="w-56 text-center flex-none">Action</p>
              </div>

              {loading ? (
                <div className="w-full min-h-[300px]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex-none flex items-center">
                        <Skeleton className="h-4 w-7" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="min-w-72 w-full max-w-[500px]">
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="w-56 flex-none flex gap-4 justify-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
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
                        <p className="w-36 flex-none">
                          {item.old_barcode_product}
                        </p>
                        <p className="w-36 flex-none">
                          {item.new_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">{item.new_name_product}</p>
                          }
                        >
                          <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-36 flex-none">
                          {formatRupiah(item.old_price_product) ?? "Rp 0"}
                        </p>
                        <p className="w-36 flex-none">
                          {formatRupiah(item.new_price_product) ?? "Rp 0"}
                        </p>
                        <div className="w-56 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
                          >
                            <ReceiptText className="w-4 h-4 mr-1" />
                            <p>Detail</p>
                          </Button>
                          <Button
                            className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
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
