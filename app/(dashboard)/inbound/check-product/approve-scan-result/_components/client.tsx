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
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  Loader,
  ReceiptText,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";

interface Category {
  id: string;
  new_barcode_product: string;
  new_name_product: string;
  new_category_product: string;
  new_price_product: string;
  new_status_product: "display";
  display_price: string;
  created_at: string;
  new_date_in_product: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/staging_approves?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetailProduct = async (id: any) => {
    try {
      const response = await axios.get(`${baseUrl}/staging_approves/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onOpen("detail-product-approve-scan-result", response.data.data.resource);
    } catch (err: any) {
      toast.error("Something went wrong.");
      setError(err.message || "An error occurred");
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
          url: `/inbound/check-product/approve-scan-result`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (cookies.get("approveScanResult")) {
      handleGetData();
      return cookies.remove("approveScanResult");
    }
  }, [cookies.get("approveScanResult")]);

  useEffect(() => {
    handleCurrentId(searchValue);
    handleGetData();
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  if (error) return <p>Error: {error}</p>;

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
          <BreadcrumbItem>Scan Result</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Approvement</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Scan Result Approvement</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="flex items-center gap-3 w-2/5">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <div className="h-9 px-4 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                Total:
                <span className="font-semibold">{page.total} Products</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() =>
                  onOpen("done-check-all-approve-scan-result-modal")
                }
                className="bg-sky-400/80 hover:bg-sky-400 text-black"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Done Check All
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-32 flex-none">Barcode</p>
                  <p className="min-w-44 w-full max-w-[400px]">Product Name</p>
                  <p className="w-44 flex-none">Category</p>
                  <p className="w-36 flex-none">Price</p>
                  <p className="w-48 flex-none">Date</p>
                  <p className="w-24 flex-none">Status</p>
                  <p className="w-24 text-center flex-none">Action</p>
                </div>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">
                        {page.from + index}
                      </p>
                      <p className="w-32 flex-none overflow-hidden text-ellipsis">
                        {item?.new_barcode_product}
                      </p>
                      <TooltipProviderPage value={item?.new_name_product}>
                        <p className="min-w-44 w-full max-w-[400px] text-ellipsis overflow-hidden whitespace-nowrap">
                          {item?.new_name_product}
                        </p>
                      </TooltipProviderPage>
                      <p className="w-44 flex-none text-ellipsis overflow-hidden whitespace-nowrap">
                        {item?.new_category_product}
                      </p>
                      <p className="w-36 flex-none text-ellipsis overflow-hidden whitespace-nowrap">
                        {formatRupiah(item?.new_price_product ?? 0)}
                      </p>
                      <p className="w-48 flex-none text-ellipsis overflow-hidden whitespace-nowrap">
                        {format(
                          new Date("10-09-2024" ?? new Date().toString()),
                          "iiii, dd-MMM-yyyy"
                        )}
                      </p>
                      <div className="w-24 flex-none">
                        <Badge
                          className={cn(
                            "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400",
                            (item?.new_status_product ?? "").toLowerCase() !==
                              "display" && "bg-yellow-400 hover:bg-yellow-400"
                          )}
                        >
                          {item?.new_status_product}
                        </Badge>
                      </div>
                      <div className="w-24 flex-none flex gap-4 justify-center">
                        <Button
                          className="items-center w-9 px-0 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                          variant={"outline"}
                          type="button"
                          onClick={() => handleGetDetailProduct(item.id)}
                        >
                          <ReceiptText className="w-4 h-4" />
                        </Button>
                        <Button
                          className="items-center w-9 px-0 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen(
                              "delete-product-approve-scan-result",
                              item.id
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
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
                    setPage((prev) => ({ ...prev, current: prev.current + 1 }))
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
    </div>
  );
};
