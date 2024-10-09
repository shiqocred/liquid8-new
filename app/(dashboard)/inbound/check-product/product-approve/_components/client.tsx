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
import { cn, formatDate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Combine,
  Grid2x2X,
  Loader,
  ReceiptText,
  RefreshCcw,
  RefreshCw,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal";

export const Client = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // search list dan detail
  const [dataSearch, setDataSearch] = useState(searchParams.get("q") ?? "");
  const searchValue = useDebounce(dataSearch);
  const [dataSearchDetail, setDataSearchDetail] = useState("");
  const searchValueDetail = useDebounce(dataSearchDetail);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state string
  const [codeDetail, setCodeDetail] = useState(
    searchParams.get("detail") ?? ""
  );
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [error, setError] = useState<string[]>([]);

  // data list dan detail
  const [data, setData] = useState<any[]>([]);
  const [dataDetail, setDataDetail] = useState<any[]>([]);

  // pagination list dan detail
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });
  const [pageDetail, setPageDetail] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });

  // handle GET list & detail
  const handleGetDocument = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/documentInProgress?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetail = async (code: string) => {
    setLoadingDetail(true);
    try {
      const response = await axios.get(
        `${baseUrl}/product-approveByDoc/${code}?page=${pageDetail.current}&q=${searchValueDetail}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataDetail(response.data.data.resource.data);
      setPageDetail({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
      setIsOpenDetail(true);
      setCodeDetail(code);
      handleCurrentId(searchValue, filter, code);
    } catch (err: any) {
      toast.error("Something went wrong.");
      setError(err.message || "An error occurred");
    } finally {
      setLoadingDetail(false);
    }
  };
  const handleGetDetailProduct = async (code: string) => {
    try {
      const response = await axios.get(`${baseUrl}/product-approves/${code}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onOpen(
        "detail=product-detail-product-approve",
        response.data.data.resource
      );
    } catch (err: any) {
      toast.error("Something went wrong.");
      setError(err.message || "An error occurred");
    }
  };

  // handle searchParams
  const handleCurrentId = useCallback(
    (q: string, f: string, i: string) => {
      setFilter(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
        detail: i,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }
      if (!i || i === "") {
        delete updateQuery.detail;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inbound/check-product/product-approve",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, filter, codeDetail);
    handleGetDocument();
  }, [searchValue]);

  useEffect(() => {
    if (codeDetail) {
      handleGetDetail(codeDetail);
    }
  }, [codeDetail, searchValueDetail]);

  // setReset if sheet not open
  useEffect(() => {
    if (!isOpenDetail) {
      setPageDetail({
        current: parseFloat("1") ?? 1, //page saat ini
        last: 1, //page terakhir
        from: 1, //data dimulai dari (untuk memulai penomoran tabel)
        total: 1, //total data
      });
      setDataDetail([]);
      setDataSearchDetail("");
      handleCurrentId(searchValue, filter, "");
    }
  }, [isOpenDetail]);

  // refreshData by cookies
  useEffect(() => {
    if (cookies.get("detailProductApprove")) {
      handleGetDetail(codeDetail);
      return cookies.remove("detailProductApprove");
    }
  }, [cookies.get("detailProductApprove")]);

  useEffect(() => {
    if (cookies.get("productDetailProductApprove")) {
      handleGetDetailProduct(cookies.get("productDetailProductApprove") ?? "0");
      return cookies.remove("productDetailProductApprove");
    }
  }, [cookies.get("productDetailProductApprove")]);

  useEffect(() => {
    if (cookies.get("productApprove")) {
      handleGetDocument();
      return cookies.remove("productApprove");
    }
  }, [cookies.get("productApprove")]);

  // doing when render
  useEffect(() => {
    setIsMounted(true);
    handleGetDocument();
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
          <BreadcrumbItem>Product Approve</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Approved Document</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full">
            <div className="w-2/5 flex items-center relative">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              {dataSearch && (
                <button
                  type="button"
                  onClick={() => setDataSearch("")}
                  className="absolute right-3"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("productApprove", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                variant={"outline"}
              >
                <RefreshCw
                  className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                />
              </Button>
            </TooltipProviderPage>
            <div className="flex items-center gap-3">
              <Popover open={isFilter} onOpenChange={setIsFilter}>
                <PopoverTrigger asChild>
                  <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                    <CircleFadingPlus className="h-4 w-4 mr-2" />
                    Status
                    {filter && (
                      <Separator
                        orientation="vertical"
                        className="mx-2 bg-gray-500 w-[1.5px]"
                      />
                    )}
                    {filter && (
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                          filter === "pending" &&
                            "bg-gray-200 hover:bg-gray-200",
                          filter === "in-progress" &&
                            "bg-yellow-400 hover:bg-yellow-400",
                          filter === "done" && "bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {filter === "pending" && "Pending"}
                        {filter === "in-progress" && "In Progress"}
                        {filter === "done" && "Done"}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-52" align="start">
                  <Command>
                    <CommandGroup>
                      <CommandList>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "pending", codeDetail);
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "pending"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                "pending",
                                codeDetail
                              );
                              setIsFilter(false);
                            }}
                          />
                          Pending
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(
                              dataSearch,
                              "in-progress",
                              codeDetail
                            );
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "in-progress"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                "in-progress",
                                codeDetail
                              );
                              setIsFilter(false);
                            }}
                          />
                          In Progress
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "done", codeDetail);
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "done"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "done", codeDetail);
                              setIsFilter(false);
                            }}
                          />
                          Done
                        </CommandItem>
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {filter && (
                <Button
                  variant={"ghost"}
                  className="flex px-3"
                  onClick={() => {
                    handleCurrentId(dataSearch, "", codeDetail);
                  }}
                >
                  Reset
                  <XCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-36 flex-none">Document Code</p>
                  <p className="w-full min-w-72 max-w-[500px]">Base Document</p>
                  <p className="w-24 flex-none">Total</p>
                  <p className="w-28 flex-none">Status</p>
                  <p className="w-36 flex-none text-center">Action</p>
                </div>
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">
                        {page.from + i}
                      </p>
                      <p className="w-36 flex-none">{item.code_document}</p>
                      <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.base_document}
                      </p>
                      <p className="w-24 flex-none">
                        {item.total_column_in_document.toLocaleString()}
                      </p>
                      <div className="w-28 flex-none">
                        <Badge
                          className={cn(
                            "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                            item.status_document === "pending" &&
                              "bg-gray-200 hover:bg-gray-200",
                            item.status_document === "in progress" &&
                              "bg-yellow-400 hover:bg-yellow-400",
                            item.status_document === "done" &&
                              "bg-green-400 hover:bg-green-400"
                          )}
                        >
                          {item.status_document}
                        </Badge>
                      </div>
                      <div className="w-36 flex gap-4 justify-center">
                        <TooltipProviderPage value={<p>To Partial Stagging</p>}>
                          <Button
                            className="items-center w-9 px-0 flex-none h-9 border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                            variant={"outline"}
                            onClick={() =>
                              onOpen(
                                "staging-document-product-approve",
                                item.code_document
                              )
                            }
                          >
                            <Combine className="w-4 h-4" />
                          </Button>
                        </TooltipProviderPage>
                        <TooltipProviderPage value={<p>Detail</p>}>
                          <Button
                            className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            onClick={(e) => {
                              e.preventDefault();
                              handleGetDetail(item.code_document);
                            }}
                          >
                            <ReceiptText className="w-4 h-4" />
                          </Button>
                        </TooltipProviderPage>
                        <TooltipProviderPage value={<p>Delete</p>}>
                          <Button
                            className="items-center w-9 px-0 flex-none h-9 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            onClick={() =>
                              onOpen(
                                "delete-document-product-approve",
                                item.code_document
                              )
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
              Total: {page.total}
            </Badge>
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
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
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
      <Sheet open={isOpenDetail} onOpenChange={setIsOpenDetail}>
        <SheetContent className="min-w-[70vw] space-y-4">
          <SheetHeader>
            <SheetTitle>Detail Product Approve</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-3 w-full">
            <div className="w-2/5 relative flex items-center">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearchDetail}
                onChange={(e) => setDataSearchDetail(e.target.value)}
                placeholder="Search..."
              />
              {dataSearchDetail && (
                <button
                  type="button"
                  onClick={() => setDataSearchDetail("")}
                  className="absolute right-3"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("detailProductApprove", "update");
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
          <div className="flex w-full flex-col gap-4">
            <div className="w-full p-4 rounded-md border border-sky-400/80">
              {loadingDetail ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <ScrollArea>
                  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                    <p className="w-10 text-center flex-none">No</p>
                    <p className="w-32 flex-none">Old Barcode</p>
                    <p className="w-32 flex-none">New Barcode</p>
                    <p className="w-full min-w-44 max-w-[400px]">
                      Product Name
                    </p>
                    <p className="w-28 flex-none">Status</p>
                    <p className="w-24 text-center flex-none">Action</p>
                  </div>

                  <ScrollArea className="max-h-[64vh] h-full min-h-[200px]">
                    {dataDetail.length > 0 ? (
                      dataDetail.map((item, i) => (
                        <div
                          key={item.id}
                          className="flex w-full px-5 py-3 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        >
                          <p className="w-10 text-center flex-none">
                            {pageDetail.from + i}
                          </p>
                          <p className="w-32 flex-none">
                            {item.old_barcode_product}
                          </p>
                          <p className="w-32 flex-none">
                            {item.new_barcode_product}
                          </p>
                          <TooltipProviderPage
                            value={
                              <p className="w-44">{item.new_name_product}</p>
                            }
                          >
                            <p className="w-full min-w-44 max-w-[400px] whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.new_name_product}
                            </p>
                          </TooltipProviderPage>
                          <div className="w-28 flex-none">
                            <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400">
                              {item.new_status_product}
                            </Badge>
                          </div>
                          <div className="w-24 flex-none flex gap-4 justify-center">
                            <TooltipProviderPage value={<p>Detail</p>}>
                              <Button
                                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                                variant={"outline"}
                                onClick={() => handleGetDetailProduct(item.id)}
                              >
                                <ReceiptText className="w-4 h-4" />
                              </Button>
                            </TooltipProviderPage>
                            <TooltipProviderPage value={"Delete"}>
                              <Button
                                className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 p-0 w-9"
                                variant={"outline"}
                                type="button"
                                onClick={() =>
                                  onOpen(
                                    "delete-detail-product-approve",
                                    item.id
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </TooltipProviderPage>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Grid2x2X className="w-8 h-8" />
                          <p className="text-sm font-semibold">
                            No Data Viewed.
                          </p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                Total: {pageDetail.total}
              </Badge>
              <div className="flex gap-5 items-center">
                <p className="text-sm">
                  Page {pageDetail.current} of {pageDetail.last}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() =>
                      setPageDetail((prev) => ({
                        ...prev,
                        current: prev.current - 1,
                      }))
                    }
                    disabled={pageDetail.current === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() =>
                      setPageDetail((prev) => ({
                        ...prev,
                        current: prev.current - 1,
                      }))
                    }
                    disabled={pageDetail.current === pageDetail.last}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
