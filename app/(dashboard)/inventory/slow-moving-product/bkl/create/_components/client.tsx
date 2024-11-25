"use client";

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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { baseUrl } from "@/lib/baseUrl";
import { useModal } from "@/hooks/use-modal";
import { cn, formatRupiah } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

import {
  Loader2,
  XCircle,
  FileDown,
  Grid2x2X,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRightCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";
import { useCookies } from "next-client-cookies";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useCallback, useEffect, useState } from "react";

import Loading from "../loading";
import Pagination from "@/components/pagination";
import Link from "next/link";

export const Client = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);

  // state search & page
  const [dataSearch, setDataSearch] = useState(searchParams.get("q") ?? "");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1, //per page data
  });
  const [pageFiltered, setPageFiltered] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1, //per page data
  });

  // cookeis
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  // handle GET
  const fetchDocuments = async (p?: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/new_product/display-expired?page=${
          p ?? page.current
        }&q=${searchValue}`,
        {
          headers: {
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
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetFiltered = async () => {
    setLoadingFiltered(true);
    try {
      const response = await axios.get(
        `${baseUrl}/bkl/filter_product?page=${pageFiltered.current}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFiltered(response.data.data.resource.data);
      setPageFiltered({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT_FILTERED:", err);
    } finally {
      setLoadingFiltered(false);
    }
  };

  // handle add filter
  const handleAddFilter = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/bkl/filter_product/${id}/add`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("successfully added product bkl list");
      cookies.set("updateBKLProduct", "added");
      cookies.set("updateBKLFilteredProduct", "added");
    } catch (err: any) {
      toast.error(
        `Error ${err.response.status}: failed to add product bkl list`
      );
      console.log("ERROR_FILTERED_PRODUCT:", err);
    }
  };

  // handle delete filter
  const handleDeleteFilter = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${baseUrl}/bkl/filter_product/destroy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("successfully deleted the product bkl list");
      cookies.set("updateBKLProduct", "deleted");
      cookies.set("updateBKLFilteredProduct", "deleted");
    } catch (err: any) {
      toast.error(
        `Error ${err.response.status}: failed to delete product bkl list`
      );
      console.log("ERROR_FILTERED_PRODUCT:", err);
    }
  };

  // handle searchParams
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
          url: "/inventory/slow-moving-product/bkl/create",
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
    if (cookies.get("updateBKLProduct")) {
      fetchDocuments();
      return cookies.remove("updateBKLProduct");
    }
  }, [cookies.get("updateBKLProduct")]);
  useEffect(() => {
    if (cookies.get("updateBKLFilteredProduct")) {
      handleGetFiltered();
      return cookies.remove("updateBKLFilteredProduct");
    }
  }, [cookies.get("updateBKLFilteredProduct")]);

  // effect search & page data
  useEffect(() => {
    handleCurrentId(searchValue, 1);
    fetchDocuments(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageBKLProduct")) {
      handleCurrentId(searchValue, page.current);
      fetchDocuments();
      return cookies.remove("pageBKLProduct");
    }
  }, [cookies.get("pageBKLProduct"), searchValue, page.current]);

  // effect page filtered
  useEffect(() => {
    handleGetFiltered();
  }, [pageFiltered.current]);

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
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/slow-moving-product/bkl/create">
              BKL
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Button
          asChild
          className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none"
        >
          <Link href="/inventory/slow-moving-product/bkl">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Add BKL</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <div className="flex flex-col w-full gap-4 mt-2">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="flex items-center gap-3 w-5/12">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("updateBKLProduct", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                  variant={"outline"}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
              <div className="h-9 px-4 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                Total:
                <span className="font-semibold">{page.total} Products</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                    Filtered Products
                    <ArrowRightCircle className="w-4 h-4 ml-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-w-[50vw]">
                  <SheetHeader>
                    <SheetTitle>List Product Stagging (Filtered)</SheetTitle>
                  </SheetHeader>
                  <div className="w-full flex flex-col gap-5 mt-5 text-sm">
                    <div className="flex gap-4 items-center w-full">
                      <div className="h-9 px-4 flex items-center rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                        Total Filtered:
                        <span className="font-semibold">
                          {pageFiltered.total} Products
                        </span>
                      </div>
                      <TooltipProviderPage value={"Reload Data"}>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            cookies.set("updateBKLFilteredProduct", "update");
                          }}
                          className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                          variant={"outline"}
                        >
                          <RefreshCw
                            className={cn(
                              "w-4 h-4",
                              loading ? "animate-spin" : ""
                            )}
                          />
                        </Button>
                      </TooltipProviderPage>
                      <Button
                        onClick={() => onOpen("done-check-all-bkl-modal")}
                        className="bg-sky-400/80 hover:bg-sky-400 text-black"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Done Check All
                      </Button>
                    </div>
                    <div className="w-full p-4 rounded-md border border-sky-400/80">
                      <ScrollArea>
                        <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                          <p className="w-10 text-center flex-none">No</p>
                          <p className="w-32 flex-none">Barcode</p>
                          <p className="w-full min-w-44 max-w-[400px]">
                            Product Name
                          </p>
                          <p className="w-14 text-center flex-none">Action</p>
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
                          <ScrollArea className="h-[64vh]">
                            {filtered.length > 0 ? (
                              filtered.map((item, i) => (
                                <div
                                  className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                                  key={item?.id}
                                >
                                  <p className="w-10 text-center flex-none">
                                    {page.from + i}
                                  </p>
                                  <p className="w-32 flex-none">
                                    {item?.new_barcode_product ??
                                      item?.old_barcode_product ??
                                      ""}
                                  </p>
                                  <TooltipProviderPage
                                    value={
                                      <p className="w-44">
                                        {item?.new_name_product}
                                      </p>
                                    }
                                  >
                                    <p className="w-full min-w-44 max-w-[400px] whitespace-nowrap text-ellipsis overflow-hidden">
                                      {item?.new_name_product}
                                    </p>
                                  </TooltipProviderPage>
                                  <div className="w-14 flex-none flex gap-4 justify-center">
                                    <TooltipProviderPage value="Remove from filter">
                                      <Button
                                        className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 p-0 w-9"
                                        variant={"outline"}
                                        type="button"
                                        onClick={(e) =>
                                          handleDeleteFilter(e, item.id)
                                        }
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </TooltipProviderPage>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="h-[300px] flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <Grid2x2X className="w-8 h-8" />
                                  <p className="text-sm font-semibold">
                                    No Data Viewed.
                                  </p>
                                </div>
                              </div>
                            )}
                          </ScrollArea>
                        )}
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                    <Pagination
                      pagination={pageFiltered}
                      setPagination={setPageFiltered}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                <p className="w-52 flex-none">Category</p>
                <p className="w-32 flex-none">Price</p>
                <p className="w-14 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full h-full">
                  {Array.from({ length: 20 }, (_, i) => (
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
                      <div className="w-full min-w-72 max-w-[500px]">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-52 flex-none">
                        <Skeleton className="w-36 h-4" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="w-14 flex-none flex gap-4 justify-center">
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
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <p className="w-32 flex-none">
                          {item?.new_barcode_product ??
                            item?.old_barcode_product ??
                            "-"}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">{item?.new_name_product}</p>
                          }
                        >
                          <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                            {item?.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-52 flex-none">
                          {item?.new_category_product ?? item?.new_tag_product}
                        </p>
                        <p className="w-32 flex-none">
                          {formatRupiah(
                            item?.new_price_product ?? item?.old_price_product
                          ) ?? "Rp 0"}
                        </p>
                        <div className="w-14 flex-none flex gap-4 justify-center">
                          <TooltipProviderPage value="Add to filter">
                            <Button
                              className="items-center w-9 px-0 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                              variant={"outline"}
                              type="button"
                              onClick={(e) => handleAddFilter(e, item.id)}
                            >
                              <PlusCircle className="w-4 h-4" />
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
          <Pagination
            pagination={page}
            setPagination={setPage}
            cookie="pageBKLProduct"
          />
        </div>
      </div>
    </div>
  );
};
