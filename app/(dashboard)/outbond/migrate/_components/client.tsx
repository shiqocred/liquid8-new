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
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import {
  Barcode,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Grid2x2X,
  Loader2,
  MapPinned,
  PlusCircle,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // state bool
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any[]>([]);
  const [detail, setDetail] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any>();

  // handle GET Data
  const handleGetData = async (p?: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/migrate-documents?page=${
          p ?? page.current
        }&q=${searchValue}`,
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
  const handleGetDetail = async (e: MouseEvent, idDetail: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(
        `${baseUrl}/migrate-documents/${idDetail}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Data successfully founded.");
      setDetail(response.data.data.resource.migrates);
      setDetailData(response.data.data.resource);
      setIsOpen(true);
    } catch (err: any) {
      toast.error("Data failed to found.");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
    }
  };
  const handleExport = async (e: MouseEvent, idDetail: any) => {
    e.preventDefault();
    setLoadingExport(true);
    try {
      const response = await axios.post(
        `${baseUrl}/exportMigrateDetail/${idDetail}`,
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
          url: "/outbond/migrate",
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
    if (cookies.get("pageMigrate")) {
      handleCurrentId(searchValue, page.current);
      handleGetData();
      return cookies.remove("pageMigrate");
    }
  }, [cookies.get("pageMigrate"), searchValue, page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("migratePage")) {
      handleGetData();
      return cookies.remove("migratePage");
    }
  }, [cookies.get("migratePage")]);

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
          <BreadcrumbItem>Outbond</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Migrate</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Migrate</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="w-full flex items-center gap-4">
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
                    cookies.set("migratePage", "update");
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
            <div className="flex gap-4">
              <Link href="/outbond/migrate/create">
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Migrate
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-40 flex-none">Document Migrate</p>
                <p className="w-60 flex-none">Date</p>
                <p className="w-20 flex-none">Qty</p>
                <p className="w-full min-w-72 max-w-[500px]">Destination</p>
                <p className="w-32 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-40 flex-none ">
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <div className="w-60 flex-none ">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-20 flex-none">
                        <Skeleton className="w-12 h-4" />
                      </div>
                      <div className="w-full min-w-72 max-w-[500px] ">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-32 flex-none flex gap-4 justify-center">
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[200px]">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <p className="w-40 flex-none overflow-hidden text-ellipsis">
                          {item.code_document_migrate}
                        </p>
                        <p className="w-60 flex-none whitespace-nowrap text-ellipsis overflow-hidden">
                          {format(
                            new Date(item.created_at),
                            "iiii, dd MMMM yyyy"
                          )}
                        </p>
                        <div className="w-20 flex-none">
                          {item.total_product_document_migrate.toLocaleString()}
                        </div>
                        <p className="w-full min-w-72 max-w-[500px] capitalize whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.destiny_document_migrate}
                        </p>
                        <div className="w-32 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-100"
                            variant={"outline"}
                            type="button"
                            disabled={loadingDetail}
                            onClick={(e) => handleGetDetail(e, item.id)}
                          >
                            {loadingDetail ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <ReceiptText className="w-4 h-4 mr-1" />
                            )}
                            <p>Detail</p>
                          </Button>
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
                  onClick={() => {
                    setPage((prev) => ({
                      ...prev,
                      current: prev.current - 1,
                    }));
                    cookies.set("pageMigrate", "removed");
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
                    cookies.set("pageMigrate", "added");
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
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="min-w-[75vw] flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>Detail Migrate</SheetTitle>
          </SheetHeader>
          <div className="flex w-full border-sky-400/80 rounded-md overflow-hidden border p-4 flex-col">
            <div className="w-full flex items-center">
              <div className="flex items-center w-full">
                <div className="flex w-72 items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold capitalize">
                    {detailData?.code_document_migrate}
                  </h3>
                </div>
                <Separator
                  orientation="vertical"
                  className="bg-gray-500 h-12"
                />
                <div className="flex w-full pl-5 items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                    <MapPinned className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold capitalize">
                    {detailData?.destiny_document_migrate}
                  </h3>
                </div>
              </div>
              <Separator orientation="vertical" className="bg-gray-500 h-12" />
              <div className="flex flex-col w-72 pl-5">
                <p className="text-xs">Total Qty</p>
                <p className="font-medium text-sm">
                  {detailData?.total_product_document_migrate.toLocaleString()}
                </p>
              </div>
              <Separator orientation="vertical" className="bg-gray-500 h-12" />
              <Button
                onClick={(e) => handleExport(e, detailData?.id)}
                className="ml-5 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700 disabled:opacity-100"
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
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Color</p>
                <p className="w-20 flex-none">Qty</p>
                <p className="w-36 flex-none ml-auto">Status</p>
              </div>
              {detail.map((item, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={item.id}
                >
                  <p className="w-10 text-center flex-none">{page.from + i}</p>
                  <p className="w-full min-w-72 max-w-[500px] capitalize whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.product_color}
                  </p>
                  <div className="w-20 flex-none">
                    {item.product_total.toLocaleString()}
                  </div>
                  <div className="w-36 flex-none ml-auto">
                    <Badge className="bg-green-400 hover:bg-green-400 font-normal rounded text-black capitalize">
                      {item.status_migrate}
                    </Badge>
                  </div>
                </div>
              ))}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
