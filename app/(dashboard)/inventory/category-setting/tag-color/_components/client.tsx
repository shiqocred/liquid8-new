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
  AlertCircle,
  AppWindowMac,
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Edit2,
  Edit3,
  FileDown,
  Grid2x2X,
  Loader2,
  Minus,
  Monitor,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Loading from "../loading";
import { baseUrl } from "@/lib/baseUrl";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PickerColor from "@/components/picker-color";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [isApk, setIsApk] = useState(
    searchParams.get("apk") === "true" ? true : false
  );
  const [color, setcolor] = useState("#000000");

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [dataSearch, setDataSearch] = useState(searchParams.get("q") ?? "");
  const searchValue = useDebounce(dataSearch);

  const [settingColor, setSettingColor] = useState<any[]>([]);
  const [settingColor2, setSettingColor2] = useState<any[]>([]);

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/color_tags?q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSettingColor(response.data.data.resource);
    } catch (err: any) {
      toast.error("Something went wrong.");
      console.log("ERROR_GET_DATA:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetail = async (e: MouseEvent, idDetail: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/color_tags/${idDetail}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully founded.");
      const dataRes = response.data.data.resource;
      onOpen("create-edit-color-modal", {
        name: dataRes?.name_color,
        hex: dataRes?.hexa_code_color,
        fixPrice: dataRes?.fixed_price_color,
        minPrice: dataRes?.min_price_color,
        maxPrice: dataRes?.max_price_color,
        type: "wms",
        id: dataRes?.id,
      });
    } catch (err: any) {
      toast.error("Data failed to found.");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
    }
  };
  const handleGetData2 = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/color_tags2?q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSettingColor2(response.data.data.resource);
    } catch (err: any) {
      toast.error("Something went wrong.");
      console.log("ERROR_GET_DATA:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetail2 = async (e: MouseEvent, idDetail: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/color_tags2/${idDetail}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully founded.");
      const dataRes = response.data.data.resource;
      onOpen("create-edit-color-modal", {
        name: dataRes?.name_color,
        hex: dataRes?.hexa_code_color,
        fixPrice: dataRes?.fixed_price_color,
        minPrice: dataRes?.min_price_color,
        maxPrice: dataRes?.max_price_color,
        type: "apk",
        id: dataRes?.id,
      });
    } catch (err: any) {
      toast.error("Data failed to found.");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCurrentId = useCallback(
    (q: string, t: boolean) => {
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        apk: "true",
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }

      if (!t) {
        delete updateQuery.apk;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inventory/category-setting/tag-color",
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
    if (cookies.get("colorPage")) {
      handleGetData();
      return cookies.remove("colorPage");
    }
  }, [cookies.get("colorPage")]);
  useEffect(() => {
    if (cookies.get("color2Page")) {
      handleGetData2();
      return cookies.remove("color2Page");
    }
  }, [cookies.get("color2Page")]);

  useEffect(() => {
    handleCurrentId(searchValue, isApk);
    if (isApk) {
      handleGetData2();
    } else {
      handleGetData();
    }
  }, [searchValue, isApk]);

  useEffect(() => {
    handleCurrentId(searchValue, isApk);
    setDataSearch("");
  }, [isApk]);

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
    handleGetData2();
  }, []);

  if (!isMounted) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Tabs defaultValue={isApk ? "apk" : "wms"} className="w-full">
        <TabsContent value="wms">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Setting Tag Color WMS</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </TabsContent>
        <TabsContent value="apk">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Setting Tag Color APK</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </TabsContent>
        <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 justify-between items-center mb-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="size-4 mr-2" />
            <p className="text-sm font-medium">Please select the type first</p>
          </div>
          <TabsList className="gap-4 bg-transparent">
            <TabsTrigger value="wms" asChild>
              <Button
                onClick={() => setIsApk(false)}
                className="data-[state=active]:bg-sky-400 bg-sky-200 hover:bg-sky-300 text-black"
              >
                <Monitor className="size-4 mr-2" />
                WMS
              </Button>
            </TabsTrigger>
            <TabsTrigger value="apk" asChild>
              <Button
                onClick={() => setIsApk(true)}
                className="data-[state=active]:bg-sky-400 bg-sky-200 hover:bg-sky-300 text-black"
              >
                <Smartphone className="size-4 mr-2" />
                APK
              </Button>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="wms">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
            <h2 className="text-xl font-bold">List Tag Colors WMS</h2>
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
                        cookies.set("colorPage", "update");
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
                    onClick={() =>
                      onOpen("create-edit-color-modal", { type: "wms" })
                    }
                    className="bg-sky-400 hover:bg-sky-400/80 text-black"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Color WMS
                  </Button>
                </div>
              </div>
              <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
                <ScrollArea>
                  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                    <p className="w-10 text-center flex-none">No</p>
                    <p className="w-10 text-center flex-none">#</p>
                    <p className="min-w-72 w-full max-w-[500px]">Color Name</p>
                    <p className="w-28 flex-none">Fixed Price</p>
                    <p className="w-32 flex-none text-center">Min. Price</p>
                    <p className="w-4 flex-none"></p>
                    <p className="w-32 flex-none text-center">Max. Price</p>
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
                          <div className="w-10 flex justify-center flex-none">
                            <Skeleton className="w-5 h-4" />
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
                      {settingColor.length > 0 ? (
                        settingColor.map((item, index) => (
                          <div
                            className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                            key={item.id}
                          >
                            <p className="w-10 text-center flex-none">
                              {index + 1}
                            </p>
                            <TooltipProviderPage value={item.hexa_code_color}>
                              <div className="w-10 flex-none flex justify-center">
                                <div
                                  className="size-5 rounded-md shadow border border-gray-500"
                                  style={{ background: item.hexa_code_color }}
                                />
                              </div>
                            </TooltipProviderPage>
                            <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap capitalize">
                              {item.name_color}
                            </p>
                            <p className="w-28 flex-none tabular-nums">
                              {formatRupiah(20000) ?? "Rp 0"}
                            </p>
                            <p className="w-32 flex-none tabular-nums text-center">
                              {formatRupiah(item.min_price_color)}
                            </p>
                            <p className="w-4 flex-none flex justify-center">
                              <Minus className="size-3" />
                            </p>
                            <p className="w-32 flex-none tabular-nums text-center">
                              {formatRupiah(item.min_price_color)}
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
                                  onOpen("delete-color-modal", {
                                    id: item.id,
                                    type: "wms",
                                  })
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
                            <p className="text-sm font-semibold">
                              No Data Viewed.
                            </p>
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
        </TabsContent>
        <TabsContent value="apk">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
            <h2 className="text-xl font-bold">List Tag Colors APK</h2>
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
                        cookies.set("color2Page", "update");
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
                    onClick={() =>
                      onOpen("create-edit-color-modal", { type: "apk" })
                    }
                    className="bg-sky-400 hover:bg-sky-400/80 text-black"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Color APK
                  </Button>
                </div>
              </div>
              <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
                <ScrollArea>
                  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                    <p className="w-10 text-center flex-none">No</p>
                    <p className="w-10 text-center flex-none">#</p>
                    <p className="min-w-72 w-full max-w-[500px]">Color Name</p>
                    <p className="w-28 flex-none">Fixed Price</p>
                    <p className="w-32 flex-none text-center">Min. Price</p>
                    <p className="w-4 flex-none"></p>
                    <p className="w-32 flex-none text-center">Max. Price</p>
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
                          <div className="w-10 flex justify-center flex-none">
                            <Skeleton className="w-5 h-4" />
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
                      {settingColor2.length > 0 ? (
                        settingColor2.map((item, index) => (
                          <div
                            className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                            key={item.id}
                          >
                            <p className="w-10 text-center flex-none">
                              {index + 1}
                            </p>
                            <TooltipProviderPage value={item.hexa_code_color}>
                              <div className="w-10 flex-none flex justify-center">
                                <div
                                  className="size-5 rounded-md shadow border border-gray-500"
                                  style={{ background: item.hexa_code_color }}
                                />
                              </div>
                            </TooltipProviderPage>
                            <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap capitalize">
                              {item.name_color}
                            </p>
                            <p className="w-28 flex-none tabular-nums">
                              {formatRupiah(20000) ?? "Rp 0"}
                            </p>
                            <p className="w-32 flex-none tabular-nums text-center">
                              {formatRupiah(item.min_price_color)}
                            </p>
                            <p className="w-4 flex-none flex justify-center">
                              <Minus className="size-3" />
                            </p>
                            <p className="w-32 flex-none tabular-nums text-center">
                              {formatRupiah(item.min_price_color)}
                            </p>
                            <div className="w-48 ml-auto flex-none flex gap-4 justify-center">
                              <Button
                                className="items-center w-full border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50 disabled:opacity-100"
                                variant={"outline"}
                                type="button"
                                onClick={(e) => handleGetDetail2(e, item.id)}
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
                                  onOpen("delete-color-modal", {
                                    id: item.id,
                                    type: "wms",
                                  })
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
                            <p className="text-sm font-semibold">
                              No Data Viewed.
                            </p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
