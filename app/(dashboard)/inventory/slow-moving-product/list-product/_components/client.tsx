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
import { format } from "date-fns";
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
  FileDown,
  Grid2x2X,
  Loader2,
  ReceiptText,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import Pagination from "@/components/pagination";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

export const Client = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { onOpen } = useModal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

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

  const [data, setData] = useState<any[]>([]);

  const handleGetData = async (p?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/new_product/expired?page=${
          p ?? page.current
        }&q=${searchValue}`,
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
  const handleGetDetail = async (e: MouseEvent, idProduct: string) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/new_products/${idProduct}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully found.");
      const dataRes = response.data.data.resource;
      onOpen("detail-list-product-smv-modal", dataRes);
    } catch (err: any) {
      toast.error("Get Detail: Something went wrong");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleExport = async (e: MouseEvent) => {
    e.preventDefault();
    setLoadingExport(true);
    try {
      const response = await axios.post(
        `${baseUrl}/exportProductExpired`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("File Successfully Exported");
      // download export
      const link = document.createElement("a");
      link.href = response.data.data.resource;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      toast.error("Data failed to export.");
      console.log("ERROR_EXPORT:", err);
    } finally {
      setLoadingExport(false);
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
          url: "/inventory/slow-moving-product/list-product",
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
          <BreadcrumbItem>List Products</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Products</h2>
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
              <Button
                onClick={handleExport}
                className="bg-sky-400/80 hover:bg-sky-400 text-black disabled:opacity-100"
                disabled={loadingExport}
              >
                {loadingExport ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <FileDown className="w-4 h-4 mr-1" />
                )}
                Export Data
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-36 flex-none">Barcode</p>
                <p className="min-w-72 w-full max-w-[500px]">Product Name</p>
                <p className="w-44 flex-none">Category</p>
                <p className="w-32 flex-none">Price In</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-48 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full min-h-[300px]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex items-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="w-28 h-4" />
                      </div>
                      <div className="min-w-72 w-full max-w-[500px]">
                        <Skeleton className="w-64 h-4" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="w-36 h-4" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="w-48 flex-none flex gap-4 justify-center">
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
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={i}
                      >
                        <p className="w-10 text-center flex-none">
                          {(page.from + i).toLocaleString()}
                        </p>
                        <p className="w-36 flex-none">
                          {item.new_barcode_product ?? item.old_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">{item.new_name_product}</p>
                          }
                        >
                          <p className="min-w-72 w-full max-w-[500px] text-ellipsis whitespace-nowrap overflow-hidden">
                            {item.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-44 flex-none">
                          {item.new_category_product ?? item.new_tag_product}
                        </p>
                        <p className="w-32 flex-none">
                          {formatRupiah(item.new_price_product) ?? "Rp 0"}
                        </p>
                        <div className="w-28 flex-none">
                          <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-red-300/80 hover:bg-red-300/80">
                            Slow Moving
                          </Badge>
                        </div>
                        <div className="w-48 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
                          >
                            <ReceiptText className="w-4 h-4 mr-1" />
                            <p>Detail</p>
                          </Button>
                          <Button
                            className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={() =>
                              onOpen("delete-list-product-smv-modal", item.id)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <div>Delete</div>
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
