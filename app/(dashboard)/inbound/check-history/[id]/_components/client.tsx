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
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileText,
  Gem,
  Grid2x2X,
  Loader,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import Loading from "../loading";
import axios from "axios";
import { toast } from "sonner";
import { useCookies } from "next-client-cookies";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { baseUrl } from "@/lib/baseUrl";

const chartConfig = {
  values: {
    label: "Values",
  },
  good: {
    label: "Good",
    color: "hsl(var(--chart-1))",
  },
  damaged: {
    label: "Damaged",
    color: "hsl(var(--chart-2))",
  },
  discrepancy: {
    label: "Discrepancy",
    color: "hsl(var(--chart-3))",
  },
  abnormal: {
    label: "Abnormal",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "good");
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any>();
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 0, //data dimulai dari (untuk memulai penomoran tabel)
    total: 0, //total data
    perPage: 0, //total data
  });

  const chartData = [
    {
      dataType: "good",
      values: data?.total_data_lolos ?? 0,
      fill: "var(--color-good)",
    },
    {
      dataType: "damaged",
      values: data?.total_data_damaged ?? 0,
      fill: "var(--color-damaged)",
    },
    {
      dataType: "discrepancy",
      values: data?.total_discrepancy ?? 0,
      fill: "var(--color-discrepancy)",
    },
    {
      dataType: "abnormal",
      values: data?.total_data_abnormal ?? 0,
      fill: "var(--color-abnormal)",
    },
  ];

  // handle GET
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/historys/${params.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data.data.resource);
    } catch (err: any) {
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT:", err);
    }
  };
  const handleGetProduct = async (type: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/${type === "good" ? "getProductLolos" : ""}${
          type === "damaged" ? "getProductDamaged" : ""
        }${type === "abnormal" ? "getProductAbnormal" : ""}${
          type === "discrepancy" ? "discrepancy" : ""
        }/${data?.code_document}?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProducts(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      toast.error(`Error ${err.response?.status}: Something went wrong`);
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async (e: MouseEvent) => {
    e.preventDefault();
    setLoadingExport(true);
    try {
      const response = await axios.post(
        `${baseUrl}/history/exportToExcel`,
        { code_document: data?.code_document },
        {
          headers: {
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
      toast.error(`Error Export ${err.response?.status}: Something went wrong`);
      console.log("ERROR_EXPORT:", err);
    } finally {
      setLoadingExport(false);
    }
  };

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.values, 0);
  }, [data]);

  const handleCurrentId = useCallback(
    (q: string, f: string, p: number) => {
      setFilter(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
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
          url: `/inbound/check-history/${params.id}`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (cookies.get("detailCheckHistory")) {
      handleGetProduct(filter);
      return cookies.remove("detailCheckHistory");
    }
  }, [cookies.get("detailCheckHistory")]);

  useEffect(() => {
    handleCurrentId(searchValue, filter, page.current);
    if (data?.code_document) {
      handleGetProduct(filter);
    }
  }, [searchValue, data?.code_document, filter, page.current]);

  useEffect(() => {
    fetchDocuments();
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
          <BreadcrumbItem>
            <BreadcrumbLink href="/inbound/check-history">
              Check History
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex flex-col gap-4">
        <div className="flex text-sm text-gray-500 py-3 rounded-md shadow bg-white w-full px-5 h-24 items-center justify-between">
          <div className="flex w-full items-center">
            <Link href={"/inbound/check-history"} className="group">
              <button
                type="button"
                className="flex items-center text-black group-hover:mr-6 mr-4 transition-all w-auto"
              >
                <div className="w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center group-hover:bg-gray-100 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </button>
            </Link>
            <div className="w-full">
              <p>Base Document</p>
              <h3 className="text-black font-semibold text-xl w-full text-ellipsis whitespace-nowrap">
                {data?.base_document}
              </h3>
            </div>
          </div>
          <Badge className="text-sky-700 bg-sky-100 hover:bg-sky-100 rounded-full border border-sky-700">
            {data?.code_document}
          </Badge>
        </div>
        <div className="w-full flex flex-col gap-4 p-3 border border-sky-500 rounded-lg">
          <div className="w-full flex gap-2 items-center py-3">
            <div className="w-9 h-9 rounded-full border-[1.5px] border-sky-500 text-sky-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Inventory Details
            </h3>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex gap-4">
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-500">
                    Total <span className="font-semibold underline">Data</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-bold text-2xl">
                      {(data?.total_data ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.precentage_total_data ?? 0)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-500">
                    Total{" "}
                    <span className="font-semibold underline">Data In</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-bold text-2xl">
                      {(data?.total_data_in ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.percentage_in ?? 0)}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-28 gap-2 flex-col">
                  <div className="flex w-full flex-col text-sm text-gray-700 font-semibold">
                    <p>Total</p>
                    <p className="underline">Good Data</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_data_lolos ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.percentage_lolos ?? 0)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-28 gap-2 flex-col">
                  <div className="flex w-full flex-col text-sm text-gray-700 font-semibold">
                    <p>Total</p>
                    <p className="underline">Damaged Data</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_data_damaged ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.percentage_damaged ?? 0)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-28 gap-2 flex-col">
                  <div className="flex w-full flex-col text-sm text-gray-700 font-semibold">
                    <p>Total</p>
                    <p className="underline">Abnormal Data</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_data_abnormal ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.percentage_abnormal ?? 0)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-28 gap-2 flex-col">
                  <div className="flex w-full flex-col text-sm text-gray-700 font-semibold">
                    <p>Total</p>
                    <p className="underline">Discrepancy Data</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_discrepancy ?? 0).toLocaleString()}
                    </h3>
                    <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                      {Math.round(data?.percentage_discrepancy ?? 0)}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-500">
                    Total{" "}
                    <span className="font-semibold underline">By Category</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-bold text-2xl">
                      {(data?.total_product_category ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-500">
                    Total{" "}
                    <span className="font-semibold underline">By Color</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-bold text-2xl">
                      {(data?.total_product_color ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-700">
                    Total{" "}
                    <span className="font-semibold underline">
                      Stagging Data
                    </span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_product_stagings ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-700">
                    Total{" "}
                    <span className="font-semibold underline">Sale Data</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_product_sales ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
                <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                  <p className="text-sm font-light text-gray-700">
                    Total{" "}
                    <span className="font-semibold underline">Bundle Data</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-bold text-2xl">
                      {(data?.total_product_bundle ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/4 flex-none flex justify-center rounded-md shadow bg-white relative px-5">
              <div className="flex text-sm text-gray-500 h-[320px] flex-none sticky top-0">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-square h-full"
                >
                  <PieChart className="flex gap-2">
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="values"
                      nameKey="dataType"
                      innerRadius={35}
                      stroke="2"
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) - 15}
                                  className="fill-muted-foreground text-xs"
                                >
                                  Total
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 10}
                                  className="fill-foreground text-sm font-bold"
                                >
                                  {totalVisitors.toLocaleString()}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="dataType" />}
                      className="-translate-y-2 w-3/4 mx-auto flex-wrap gap-y-1 gap-x-4 [&>*]:basis-1/4 [&>*]:justify-center "
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 p-3 border border-sky-500 rounded-lg">
          <div className="w-full flex gap-2 items-center py-3">
            <div className="w-9 h-9 rounded-full border-[1.5px] border-sky-500 text-sky-500 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Financial Details
            </h3>
          </div>
          <div className="w-full flex gap-4">
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Good Bundle
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.lolosBundle?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.lolosBundle?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">Price Good Sale</span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.lolosSale?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.lolosSale?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Good Stagging
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.lolosStaging?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.lolosStaging?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Damaged Stagging
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.damagedStaging?.total_old_price) ??
                    "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.damagedStaging?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-sky-200 rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Abnormal Stagging
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.abnormalStaging?.total_old_price) ??
                    "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.abnormalStaging?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">Price Good Data</span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.lolos?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.lolos?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Damaged Data
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.damaged?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.damaged?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Abnormal Data
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.abnormal?.total_old_price) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.abnormal?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total{" "}
                <span className="font-semibold underline">
                  Price Discrepancy Data
                </span>
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-xl">
                  {formatRupiah(data?.priceDiscrepancy) ?? "Rp. 0"}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    {Math.round(data?.price_percentage ?? 0)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-28 gap-4 flex-col">
            <p className="text-sm font-light text-gray-500">
              Total <span className="font-semibold underline">Price</span>
            </p>
            <div className="flex justify-between gap-1">
              <h3 className="text-gray-700 font-bold text-xl">
                {formatRupiah(data?.total_price) ?? "Rp. 0"}
              </h3>
              <div>
                <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                  100%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold capitalize">
          List Data <span className="underline">{filter}</span>
        </h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("detailCheckHistory", "update");
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
              <div className="flex items-center justify-start w-full">
                <div className="flex items-center gap-3">
                  <Popover open={isFilter} onOpenChange={setIsFilter}>
                    <PopoverTrigger asChild>
                      <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                        Type
                        {filter && (
                          <Separator
                            orientation="vertical"
                            className="mx-2 bg-gray-500 w-[1.5px]"
                          />
                        )}
                        {filter && (
                          <Badge
                            className={cn(
                              "rounded w-24 px-0 justify-center text-black font-normal capitalize",
                              filter === "good" &&
                                "bg-sky-200 hover:bg-sky-200",
                              filter === "damaged" &&
                                "bg-red-200 hover:bg-red-200",
                              filter === "abnormal" &&
                                "bg-green-200 hover:bg-green-200",
                              filter === "discrepancy" &&
                                "bg-yellow-200 hover:bg-yellow-200"
                            )}
                          >
                            {filter === "good" && "Good"}
                            {filter === "damaged" && "Damaged"}
                            {filter === "abnormal" && "Abnormal"}
                            {filter === "discrepancy" && "Discrepancy"}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-52" align="start">
                      <Command>
                        <CommandGroup>
                          <CommandList>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(
                                  dataSearch,
                                  "good",
                                  page.current
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "good"}
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "good",
                                    page.current
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Good
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(
                                  dataSearch,
                                  "damaged",
                                  page.current
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "damaged"}
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "damaged",
                                    page.current
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Damaged
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(
                                  dataSearch,
                                  "abnormal",
                                  page.current
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "abnormal"}
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "abnormal",
                                    page.current
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Abnormal
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(
                                  dataSearch,
                                  "discrepancy",
                                  page.current
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "discrepancy"}
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "discrepancy",
                                    page.current
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Discrepancy
                            </CommandItem>
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleExport}
              className="bg-sky-400/80 hover:bg-sky-400 text-black disabled:opacity-100"
              disabled={loadingExport}
            >
              {loadingExport ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-36 flex-none">Old Barcode</p>
                <p className="w-36 flex-none">New Barcode</p>
                <p className="w-full min-w-80 max-w-[600px] text-center">
                  Name
                </p>
                <p className="w-8 text-center flex-none">Qty</p>
                <p className="w-40 flex-none text-center">Price</p>
              </div>
              {loading ? (
                <div className="w-full h-full">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="w-28 h-4" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="w-28 h-4" />
                      </div>
                      <div className="w-full min-w-80 max-w-[600px]">
                        <Skeleton className="w-64 h-4" />
                      </div>
                      <div className="w-8 flex justify-center flex-none">
                        <Skeleton className="w-5 h-4" />
                      </div>
                      <div className="w-40 flex-none flex justify-center">
                        <Skeleton className="w-32 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full">
                  {products.length > 0 ? (
                    products.map((item, index) => (
                      <div
                        className="flex w-full px-5 py-3 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + index}
                        </p>
                        <div className="w-36 flex-none flex items-center">
                          {item?.old_barcode_product}
                        </div>
                        <p className="w-36 flex-none">
                          {item?.new_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="max-w-80 w-full">
                              {item?.new_name_product}
                            </p>
                          }
                        >
                          <p className="w-full min-w-80 max-w-[600px] text-ellipsis whitespace-nowrap overflow-hidden text-start">
                            {item?.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-8 text-center flex-none">
                          {Math.round(item?.new_quantity_product)}
                        </p>
                        <div className="w-40 flex-none flex justify-center gap-4">
                          {formatRupiah(item?.old_price_product) ?? "Rp. 0"}
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
