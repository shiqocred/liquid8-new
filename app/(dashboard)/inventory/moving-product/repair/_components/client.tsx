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
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  Grid2x2X,
  PackageOpen,
  PlusCircle,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { useModal } from "@/hooks/use-modal";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Pagination from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export const Client = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state search & filter
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);

  // state data
  const [repairs, setRepairs] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  const [error, setError] = useState<string | null>(null);

  // handle GET Data
  const handleGetData = async (p?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/repair-mv?page=${p ?? page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRepairs(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
        perPage: response.data.data.resource.per_page,
      });
    } catch (err: any) {
      console.log("ERROR_GET_BUNDLES:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle search params
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
      if (!p || p === 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inventory/moving-product/repair",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  // update search & page
  useEffect(() => {
    handleCurrentId(searchValue, 1);
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageRepair")) {
      handleCurrentId(searchValue, page.current);
      handleGetData();
      return cookies.remove("pageRepair");
    }
  }, [cookies.get("pageRepair"), searchValue, page.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("repairPage")) {
      handleGetData();
      return cookies.remove("repairPage");
    }
  }, [cookies.get("repairPage")]);

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
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Repair</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Repair</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="w-full flex gap-4 items-center">
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
                    cookies.set("repairPage", "update");
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
              <Link href="/inventory/moving-product/repair/create">
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Repair
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode Repair</p>
                <p className="w-full min-w-72 max-w-[500px]">Repair Name</p>
                <p className="w-20 flex-none">Qty</p>
                <p className="w-40 flex-none">Total Price</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-52 text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full min-h-[300px]">
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
                      <div className="w-full min-w-72 max-w-[500px]">
                        <Skeleton className="w-60 h-4" />
                      </div>
                      <div className="w-20 flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-40 flex-none">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="w-52 flex-none flex gap-4 justify-center">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-28 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {repairs.length > 0 ? (
                    repairs.map((repair: any, i: any) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={i}
                      >
                        <p className="w-10 text-center flex-none">{i + 1}</p>
                        <p className="w-32 flex-none overflow-hidden text-ellipsis">
                          {repair.barcode}
                        </p>
                        <TooltipProviderPage
                          value={<p className="w-72">{repair.repair_name}</p>}
                        >
                          <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden capitalize">
                            {repair.repair_name}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-20 flex-none">
                          {repair.total_products}
                        </p>
                        <p className="w-40 flex-none">
                          {formatRupiah(Math.round(repair.total_price)) ??
                            "Rp 0"}
                        </p>
                        <div className="w-28 flex-none">
                          <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-sky-400 hover:bg-sky-400">
                            {repair.product_status}
                          </Badge>
                        </div>
                        <div className="w-52 flex-none flex gap-4 justify-center">
                          <Link
                            href={`/inventory/moving-product/repair/${repair.id}`}
                          >
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
                            onClick={() =>
                              onOpen("delete-moving-product-repair", repair.id)
                            }
                          >
                            <PackageOpen className="w-4 h-4 mr-1" />
                            <p>Unrepair</p>
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
            cookie="pageRepair"
          />
        </div>
      </div>
    </div>
  );
};
