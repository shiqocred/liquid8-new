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
  Grid2x2X,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  Trash2,
} from "lucide-react";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import { toast } from "sonner";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useModal } from "@/hooks/use-modal";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/pagination";
import slug from "slug";

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
        `${baseUrl}/product-brands?page=${p ?? page.current}&q=${searchValue}`,
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
        `${baseUrl}/product-brands/${idDetail}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Data successfully founded.");
      const dataRes = response.data.data.resource;
      onOpen("create-edit-brand-palet-modal", {
        id: dataRes.id,
        name: dataRes.brand_name,
        slug: dataRes.brand_slug,
      });
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
          url: "/inventory/pallet/brand",
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
    if (cookies.get("pageBrandPalet")) {
      handleCurrentId(searchValue, page.current);
      handleGetData();
      return cookies.remove("pageBrandPalet");
    }
  }, [cookies.get("pageBrandPalet"), searchValue, page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("brandPaletPage")) {
      handleGetData();
      return cookies.remove("brandPaletPage");
    }
  }, [cookies.get("brandPaletPage")]);

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
          <BreadcrumbItem>Inventory</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/pallet/list">
              Pallet
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Brand</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Brand Palet</h2>
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
                    cookies.set("brandPaletPage", "update");
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
            <Button
              className="bg-sky-300 hover:bg-sky-300/80 text-black"
              type="button"
              onClick={() => onOpen("create-edit-brand-palet-modal")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-full">Name</p>
                <p className="w-full">Slug</p>
                <p className="w-52 text-center flex-none">Action</p>
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
                      <div className="w-full">
                        <Skeleton className="w-52 h-4" />
                      </div>
                      <div className="w-full ">
                        <Skeleton className="w-28 h-4" />
                      </div>

                      <div className="w-52 flex flex-none  gap-4 justify-center">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-28 h-4" />
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
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize">
                          {item.brand_name}
                        </p>
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.brand_slug}
                        </p>

                        <div className="w-52 flex flex-none  gap-4 justify-center">
                          <Button
                            className="items-center border-yellow-700 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-100"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
                          >
                            <ReceiptText className="w-4 h-4 mr-1" />
                            <p>Edit</p>
                          </Button>
                          <Button
                            className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={() =>
                              onOpen("delete-brand-palet-modal", item.id)
                            }
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
            cookie="pageBrandPalet"
          />
          {/* <Input
            onChange={(e) => {
              const value = e.target.value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
              if (value) {
                setInput((prev) => ({
                  ...prev,
                  latitude: value[1],
                  longitude: value[2],
                }));
              }
            }}
          />
          <p>{input.latitude}</p>
          <p>{input.longitude}</p> */}
        </div>
      </div>
    </div>
  );
};
