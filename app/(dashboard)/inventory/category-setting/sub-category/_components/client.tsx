"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatRupiah } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Edit2,
  Edit3,
  FileDown,
  Grid2x2X,
  Loader2,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useCookies } from "next-client-cookies";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "../loading";
import { toast } from "sonner";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);

  const [settingCategory, setSettingCategory] = useState<any[]>([]);

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleGetCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/categories?q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSettingCategory(response.data.data.resource);
    } catch (err: any) {
      console.log("ERROR_GET_CATEGORY:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDetail = async (e: MouseEvent, idDetail: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/categories/${idDetail}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully founded.");
      const dataRes = response.data.data.resource;
      onOpen("create-edit-category-modal", {
        name: dataRes?.name_category,
        discount: dataRes?.discount_category,
        maxPrice: dataRes?.max_price_category,
        id: dataRes?.id,
      });
    } catch (err: any) {
      toast.error("Data failed to found.");
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
        `${baseUrl}/exportCategory`,
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
          url: "/inventory/category-setting/sub-category",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  // auto update
  useEffect(() => {
    if (cookies.get("categoryPage")) {
      handleGetCategory();
      return cookies.remove("categoryPage");
    }
  }, [cookies.get("categoryPage")]);

  useEffect(() => {
    handleCurrentId(searchValue);
    handleGetCategory();
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
    handleGetCategory();
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
          <BreadcrumbItem>Setting Sub Category</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Sub Categories</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex justify-between">
            <div className="flex gap-2 items-center w-full">
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
                    cookies.set("categoryPage", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50 disabled:opacity-100"
                  variant={"outline"}
                  disabled={loading}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => onOpen("create-edit-category-modal")}
                className="hover:bg-sky-400 bg-sky-400/80 text-black"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Button>
              <Button
                onClick={handleExport}
                className="hover:bg-sky-400 bg-sky-400/80 text-black"
                disabled={loadingExport}
              >
                {loadingExport ? (
                  <Loader2 className="w-4 animate-spin h-4 mr-2" />
                ) : (
                  <FileDown className="w-4 h-4 mr-2" />
                )}
                Export Data
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="min-w-72 w-full max-w-[500px]">Category Name</p>
                <p className="w-28 flex-none">Discount</p>
                <p className="w-52 flex-none">Max. Price</p>
                <p className="w-48 ml-auto text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full min-h-[200px]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="min-w-72 w-full max-w-[500px]">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="w-52 flex-none ">
                        <Skeleton className="w-44 h-4" />
                      </div>
                      <div className="w-48 ml-auto flex-none flex gap-4 justify-center">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-28 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[200px]">
                  {settingCategory.length > 0 ? (
                    settingCategory.map((item, index) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {index + 1}
                        </p>
                        <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.name_category}
                        </p>
                        <p className="w-28 flex-none tabular-nums">
                          {item.discount_category}%
                        </p>
                        <p className="w-52 flex-none tabular-nums ">
                          {formatRupiah(item.max_price_category)}
                        </p>
                        <div className="w-48 ml-auto flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center w-full border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50 disabled:opacity-100"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
                            disabled={loadingDetail}
                          >
                            {loadingDetail ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Edit2 className="w-4 h-4 mr-1" />
                            )}
                            <p>Edit</p>
                          </Button>
                          <Button
                            className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={() =>
                              onOpen("delete-category-modal", item.id)
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
        </div>
      </div>
    </div>
  );
};
