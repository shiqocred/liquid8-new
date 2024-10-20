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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileDown,
  LayoutGrid,
  LayoutList,
  Loader,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useCookies } from "next-client-cookies";
import { cn, formatRupiah } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, endOfMonth, format, subDays } from "date-fns";
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Loading from "../loading";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  product_category_sale: string;
  total_category: number;
  display_price_sale: number;
  purchase: number;
}

const ContentLegendMonthly = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex w-full justify-center gap-x-6 items-center text-xs flex-wrap mt-5">
      {payload.map((item: any) => (
        <div key={item.id} className="flex gap-x-2 items-center capitalize">
          <div
            key={item.id}
            className="h-2 w-3 rounded"
            style={{ backgroundColor: item.color }}
          />
          {item.value}
        </div>
      ))}
    </ul>
  );
};
const ContentLegendAnnualy = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex w-full justify-center gap-x-6 items-center text-xs flex-wrap mt-5">
      {payload.map((item: any) => (
        <div key={item.id} className="flex gap-x-2 items-center capitalize">
          <div
            key={item.id}
            className="h-2 w-3 rounded"
            style={{ backgroundColor: item.color }}
          />
          {item.value}
        </div>
      ))}
    </ul>
  );
};

const colorPalette = [
  "#a3e635",
  "#475569",
  "#dc2626",
  "#2dd4bf",
  "#f97316",
  "#facc15",
  "#9ca3af",
  "#22c55e",
  "#0ea5e9",
  "#6d28d9",
  "#c084fc",
  "#fb7185",
  "#be123c",
  "#020617",
  "#854d0e",
  "#f87171",
];

export const Client = () => {
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [layout, setLayout] = useState(searchParams.get("l") ?? "list");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const currentDate = new Date();
  const minDate = subDays(currentDate, 49);
  const maxDate = endOfMonth(currentDate);
  const [yearCurrent, setYearCurrent] = useState(
    new Date().getFullYear().toString()
  );
  const [colorMapMonthly, setColorMapMonthly] = useState<{
    [key: string]: string;
  }>({});
  const [colorMapAnnualy, setColorMapAnnualy] = useState<{
    [key: string]: string;
  }>({});
  const [chartDataMonthly, setChartDataMonthly] = useState<ChartData[]>([
    {
      product_category_sale: "",
      total_category: 0,
      display_price_sale: 0,
      purchase: 0,
    },
  ]);
  const [chartDataAnnualy, setChartDataAnnualy] = useState<ChartData[]>([
    {
      product_category_sale: "",
      total_category: 0,
      display_price_sale: 0,
      purchase: 0,
    },
  ]);
  const [dataMonthly, setDataMonthly] = useState<any>();
  const [dataAnnualy, setDataAnnualy] = useState<any>();

  const [date, setDate] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  const clearRange = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDate([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setDate([selection]);
  };

  const getAnalyticSaleMonthly = async () => {
    setLoadingMonth(true);
    const from = date[0].startDate
      ? format(date[0].startDate, "dd-MM-yyyy")
      : "";
    const to = date[0].endDate ? format(date[0].endDate, "dd-MM-yyyy") : "";
    try {
      const res = await axios.get(
        `${baseUrl}/dashboard/monthly-analytic-sales?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChartDataMonthly(res.data.data.resource.chart);
      setDataMonthly(res.data.data.resource);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMonth(false);
    }
  };
  const getAnalyticSaleAnnualy = async () => {
    setLoadingYear(true);
    try {
      const res = await axios.get(
        `${baseUrl}/dashboard/yearly-analytic-sales?y=${yearCurrent}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChartDataAnnualy(res.data.data.resource.chart);
      setDataAnnualy(res.data.data.resource);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingYear(false);
    }
  };

  const clearSearch = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDataSearch("");
  };

  const handleCurrentId = useCallback(
    (q: string, l: string) => {
      setLayout(l);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        l: l,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!l || l === "") {
        delete updateQuery.l;
        setLayout("");
      }

      const url = qs.stringifyUrl(
        {
          url: "/dashboard/analytic-sale",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const uniqueKeysMonthly = Array.from(
      chartDataMonthly
        ? chartDataMonthly.reduce((keys: any, entry: any) => {
            Object.keys(entry).forEach((key) => {
              if (key !== "date") {
                keys.add(key);
              }
            });
            return keys;
          }, new Set<string>())
        : [].reduce((keys: any, entry: any) => {
            Object.keys(entry).forEach((key) => {
              if (key !== "date") {
                keys.add(key);
              }
            });
            return keys;
          }, new Set<string>())
    );

    const newColorMapMonthly: { [key: string]: string } = {};
    uniqueKeysMonthly.forEach((key: any, index: any) => {
      // Use existing color or generate a new color if palette is exhausted
      newColorMapMonthly[key] =
        colorPalette[index] ||
        `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });

    setColorMapMonthly(newColorMapMonthly);
  }, [date, chartDataMonthly]);

  useEffect(() => {
    const uniqueKeysAnnualy = Array.from(
      chartDataAnnualy
        ? chartDataAnnualy.reduce((keys: any, entry: any) => {
            Object.keys(entry).forEach((key) => {
              if (
                key !== "month" &&
                key !== "total_all_category" &&
                key !== "display_price_sale" &&
                key !== "purchase"
              ) {
                keys.add(key);
              }
            });
            return keys;
          }, new Set<string>())
        : [].reduce((keys: any, entry: any) => {
            Object.keys(entry).forEach((key) => {
              if (
                key !== "month" &&
                key !== "total_all_category" &&
                key !== "display_price_sale" &&
                key !== "purchase"
              ) {
                keys.add(key);
              }
            });
            return keys;
          }, new Set<string>())
    );

    const newColorAnnualy: { [key: string]: string } = {};
    uniqueKeysAnnualy.forEach((key: any, index: any) => {
      // Use existing color or generate a new color if palette is exhausted
      newColorAnnualy[key] =
        colorPalette[index] ||
        `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });

    setColorMapAnnualy(newColorAnnualy);
  }, [yearCurrent, chartDataAnnualy]);

  const ContentTooltipMonthly = ({
    active,
    payload,
    label,
  }: {
    active: boolean | undefined;
    payload: any;
    label: string;
  }) => {
    if (active && payload && label) {
      const currentData = dataMonthly.chart.find((d: any) => d.month === label);
      return (
        <div className="bg-white rounded px-3 py-1.5 border text-xs dark:bg-gray-900 shadow-sm">
          <p className="text-sm font-bold my-2">{label}</p>
          <div className="mb-2 bg-gray-500 dark:bg-gray-300 w-full h-[1px]" />
          <div className="flex flex-col">
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total All Category:</p>
              <p>{currentData?.total_all_category.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total Display Price:</p>
              <p>{formatRupiah(currentData?.display_price_sale ?? "0")}</p>
            </div>
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total Price Sale:</p>
              <p>{formatRupiah(currentData?.purchase ?? "0")}</p>
            </div>
            <p className="font-bold mb-2">Quantity:</p>
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center">
                <p
                  className="w-3 h-2 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-center w-full gap-2">
                  <p className="text-black w-full">{item.name}</p>
                  <p className="flex flex-none whitespace-nowrap">
                    : {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  const ContentTooltipAnnualy = ({
    active,
    payload,
    label,
  }: {
    active: boolean | undefined;
    payload: any;
    label: string;
  }) => {
    if (active && payload && label) {
      const currentData = dataAnnualy.chart.find((d: any) => d.month === label);
      return (
        <div className="bg-white rounded px-3 py-1.5 border text-xs dark:bg-gray-900 shadow-sm">
          <p className="text-sm font-bold my-2">{label}</p>
          <div className="mb-2 bg-gray-500 dark:bg-gray-300 w-full h-[1px]" />
          <div className="flex flex-col">
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total All Category:</p>
              <p>{currentData?.total_all_category.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total Display Price:</p>
              <p>{formatRupiah(currentData?.display_price_sale ?? "0")}</p>
            </div>
            <div className="flex items-center gap-4 justify-between mb-1">
              <p className="font-bold">Total Price Sale:</p>
              <p>{formatRupiah(currentData?.purchase ?? "0")}</p>
            </div>
            <p className="font-bold mb-2">Quantity:</p>
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center">
                <p
                  className="w-3 h-2 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-center w-full gap-2">
                  <p className="text-black w-full">{item.name}</p>
                  <p className="flex flex-none whitespace-nowrap">
                    : {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (cookies.get("analitycSaleMonth")) {
      getAnalyticSaleMonthly();
      return cookies.remove("analitycSaleMonth");
    }
  }, [cookies.get("analitycSaleMonth")]);

  useEffect(() => {
    if (cookies.get("analitycSaleYear")) {
      getAnalyticSaleAnnualy();
      return cookies.remove("analitycSaleYear");
    }
  }, [cookies.get("analitycSaleYear")]);

  useEffect(() => {
    handleCurrentId(searchValue, layout);
  }, [searchValue]);

  useEffect(() => {
    getAnalyticSaleAnnualy();
  }, [yearCurrent]);

  useEffect(() => {
    getAnalyticSaleMonthly();
  }, [date]);

  useEffect(() => {
    getAnalyticSaleMonthly();
    getAnalyticSaleAnnualy();
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
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Analytic Sale</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs className="w-full mt-5" defaultValue="monthly">
        <div className="relative w-full flex justify-center">
          <TabsList className="absolute -top-6 p-1 h-auto border-2 border-white shadow bg-gray-200">
            <TabsTrigger
              className="px-5 py-2 data-[state=active]:text-black text-gray-700"
              value="monthly"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              className="px-5 py-2 data-[state=active]:text-black text-gray-700"
              value="annualy"
            >
              Annualy
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="monthly" className="w-full gap-4 flex flex-col">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <div className="w-full justify-between items-center flex mb-5">
              <h2 className="text-xl font-bold">Analytic Sale Monthly</h2>
              <div className="flex gap-2">
                <div className="px-3 h-10 py-1 border rounded flex gap-3 items-center text-sm border-gray-500">
                  <p>
                    {dataMonthly?.month.current_month.month +
                      " " +
                      dataMonthly?.month.current_month.year}
                  </p>
                  {dataMonthly?.month.date_from.date !== null && (
                    <>
                      <p className="w-[1px] h-full bg-black" />
                      <p>
                        {dataMonthly?.month.date_from.date +
                          " " +
                          dataMonthly?.month.date_from.month +
                          " " +
                          dataMonthly?.month.date_from.year +
                          " - " +
                          (dataMonthly?.month.date_to.date +
                            " " +
                            dataMonthly?.month.date_to.month +
                            " " +
                            dataMonthly?.month.date_to.year)}
                      </p>
                      <button onClick={clearRange}>
                        <XCircle className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  )}
                  <p className="w-[1px] h-full bg-black" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={() => {}}>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-auto max-w-5xl p-3 border-gray-300">
                      <DialogHeader>
                        <DialogTitle>Pick a Date Range</DialogTitle>
                      </DialogHeader>
                      <DateRangePicker
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        maxDate={maxDate}
                        minDate={minDate}
                        direction="horizontal"
                        ranges={date}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <button
                  type="button"
                  onClick={() => cookies.set("analitycSaleMonth", "updated")}
                  className="w-10 h-10 flex items-center justify-center border border-l-none rounded border-gray-500 hover:bg-sky-100"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-[500px] w-full relative">
              {loadingMonth ? (
                <div className="w-full h-full absolute top-0 left-0 bg-sky-500/15 backdrop-blur z-10 rounded flex justify-center items-center border border-sky-500">
                  <Loader className="w-7 h-7 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataMonthly}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 30,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      vertical={false}
                      className="stroke-gray-200"
                      horizontalCoordinatesGenerator={(props) =>
                        props.height > 400
                          ? [40, 140, 220, 300, 380]
                          : [100, 200]
                      }
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#000"
                      label={{ fontSize: "10px", color: "#fff" }}
                      padding={{ left: 0, right: 0 }}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: "10px", height: "20px" }}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload, label }) => (
                        <ContentTooltipMonthly
                          active={active}
                          payload={payload}
                          label={label}
                        />
                      )}
                    />
                    <Legend
                      margin={{ top: 50, bottom: 0, left: 0, right: 0 }}
                      content={<ContentLegendMonthly />}
                    />
                    {Object.keys(colorMapMonthly).map((key) => (
                      <Bar
                        stackId={"a"}
                        dataKey={key}
                        fill={colorMapMonthly[key]}
                        key={key}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-1/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Total Category</p>
              {loadingMonth ? (
                <Skeleton className="w-1/5 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {(
                    dataMonthly?.monthly_summary.total_category ?? "0"
                  ).toLocaleString()}
                </p>
              )}
            </div>
            <div className="w-2/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Display Price</p>
              {loadingMonth ? (
                <Skeleton className="w-2/3 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {formatRupiah(
                    dataMonthly?.monthly_summary.display_price_sale
                  )}
                </p>
              )}
            </div>
            <div className="w-2/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Sale Price</p>
              {loadingMonth ? (
                <Skeleton className="w-2/5 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {formatRupiah(dataMonthly?.monthly_summary.purchase)}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center flex-col">
            <div className="w-full flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                List Product Per-Category
              </h3>
              <div className="w-full flex justify-between items-center">
                <div
                  className="flex items-center gap-5"
                  style={{ width: "60%" }}
                >
                  <div className="relative w-full flex items-center mb-0">
                    <Label className="absolute left-3" htmlFor="search">
                      <Search className="w-4 h-4" />
                    </Label>
                    <input
                      id="search"
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                      className="w-full h-9 rounded outline-none px-10 text-xs border border-gray-500"
                    />
                    <button
                      onClick={clearSearch}
                      className={cn(
                        "h-5 w-5 absolute right-2 items-center justify-center outline-none",
                        dataSearch.length > 0 ? "flex" : "hidden"
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex border border-gray-500 rounded flex-none h-9 overflow-hidden">
                    <button
                      className={cn(
                        "w-9 h-full flex items-center justify-center outline-none",
                        layout === "list" ? "bg-sky-300" : "bg-transparent"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCurrentId(searchValue, "list");
                      }}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                      className={cn(
                        "w-9 h-full flex items-center justify-center outline-none",
                        layout === "grid" ? "bg-sky-300" : "bg-transparent"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCurrentId(searchValue, "grid");
                      }}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {layout === "grid" ? (
              <div className="grid grid-cols-4 gap-4 w-full">
                {searchValue ? (
                  dataMonthly?.list_analytic_sale.filter((item: any) =>
                    item.product_category_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ).length > 0 ? (
                    dataMonthly?.list_analytic_sale
                      .filter((item: any) =>
                        item.product_category_sale
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((item: any, i: any) => (
                        <div
                          key={item.code_document_sale}
                          className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                        >
                          <div className="flex w-full items-center gap-4">
                            <p className="text-sm font-bold text-black w-full">
                              {item.product_category_sale}
                            </p>
                            <div className="flex flex-col justify-center flex-none relative w-10 h-10 items-center group">
                              <p className="w-full h-full bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full z-20">
                                {item.total_category}
                              </p>
                              <p className="text-xs font-bold absolute transition-all group-hover:-translate-x-8 px-0 group-hover:pr-3 group-hover:pl-2 h-5 bg-white rounded-l-full z-10 group-hover:h-7 flex items-center justify-center group-hover:border">
                                QTY
                              </p>
                            </div>
                          </div>
                          <div className="w-full h-[1px] bg-gray-500 my-2" />
                          <div className="flex flex-col">
                            <p className="text-xs font-light text-gray-500">
                              Display Price
                            </p>
                            <p className="text-sm font-light text-gray-800">
                              {formatRupiah(item.display_price_sale)}
                            </p>
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-xs font-light text-gray-500">
                              Sale Price
                            </p>
                            <p className="text-sm font-light text-gray-800">
                              {formatRupiah(item.purchase)}
                            </p>
                          </div>
                          <p className="absolute text-end text-[100px] font-bold -bottom-8 right-2 text-gray-300/40 z-0">
                            {i + 1}
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                      <div className="w-full flex-none text-center font-semibold">
                        No Data Viewed.
                      </div>
                    </div>
                  )
                ) : dataMonthly?.list_analytic_sale.length > 0 ? (
                  dataMonthly?.list_analytic_sale.map((item: any, i: any) => (
                    <div
                      key={item.code_document_sale}
                      className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                    >
                      <div className="flex w-full items-center gap-4">
                        <p className="text-sm font-bold text-black w-full">
                          {item.product_category_sale}
                        </p>
                        <div className="flex flex-col justify-center flex-none relative w-10 h-10 items-center group">
                          <p className="w-full h-full bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full z-20">
                            {item.total_category}
                          </p>
                          <p className="text-xs font-bold absolute transition-all group-hover:-translate-x-8 px-0 group-hover:pr-3 group-hover:pl-2 h-5 bg-white rounded-l-full z-10 group-hover:h-7 flex items-center justify-center group-hover:border">
                            QTY
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-[1px] bg-gray-500 my-2" />
                      <div className="flex flex-col">
                        <p className="text-xs font-light text-gray-500">
                          Display Price
                        </p>
                        <p className="text-sm font-light text-gray-800">
                          {formatRupiah(item.display_price_sale)}
                        </p>
                      </div>
                      <div className="flex flex-col  mt-2">
                        <p className="text-xs font-light text-gray-500">
                          Sale Price
                        </p>
                        <p className="text-sm font-light text-gray-800">
                          {formatRupiah(item.purchase)}
                        </p>
                      </div>
                      <p className="absolute text-end text-[100px] font-bold -bottom-8 right-2 text-gray-300/40 z-0">
                        {i + 1}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                    <div className="w-full flex-none text-center font-semibold">
                      No Data Viewed.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full text-sm">
                <div className="w-full flex items-center h-10 px-5 gap-4 bg-sky-300 rounded">
                  <div className="w-10 font-semibold flex-none text-center">
                    No
                  </div>
                  <div className="w-full min-w-72 text-center font-semibold">
                    Category Name
                  </div>
                  <div className="w-28 flex-none text-center font-semibold">
                    Quantity
                  </div>
                  <div className="w-44 flex-none text-center font-semibold">
                    Display Price
                  </div>
                  <div className="w-44 flex-none text-center font-semibold">
                    Sale Price
                  </div>
                </div>
                {searchValue ? (
                  dataMonthly?.list_analytic_sale.filter((item: any) =>
                    item.product_category_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ).length > 0 ? (
                    dataMonthly?.list_analytic_sale
                      .filter((item: any) =>
                        item.product_category_sale
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((item: any, i: any) => (
                        <div
                          key={item.product_category_sale}
                          className="w-full flex items-center h-10 px-5 gap-4 hover:border-sky-500 border-b border-sky-200"
                        >
                          <div className="w-10 flex-none text-center">
                            {i + 1}
                          </div>
                          <div className="w-full min-w-72 text-start">
                            {item.product_category_sale}
                          </div>
                          <div className="w-28 flex-none text-center">
                            {item.total_category}
                          </div>
                          <div className="w-44 flex-none text-center">
                            {formatRupiah(parseFloat(item.display_price_sale))}
                          </div>
                          <div className="w-44 flex-none text-center">
                            {formatRupiah(parseFloat(item.purchase))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                      <div className="w-full flex-none text-center font-semibold">
                        No Data Viewed.
                      </div>
                    </div>
                  )
                ) : dataMonthly?.list_analytic_sale.length > 0 ? (
                  dataMonthly?.list_analytic_sale.map((item: any, i: any) => (
                    <div
                      key={item.product_category_sale}
                      className="w-full flex items-center h-10 px-5 gap-4 hover:border-sky-500 border-b border-sky-200"
                    >
                      <div className="w-10 flex-none text-center">{i + 1}</div>
                      <div className="w-full min-w-72 text-start">
                        {item.product_category_sale}
                      </div>
                      <div className="w-28 flex-none text-center">
                        {item.total_category}
                      </div>
                      <div className="w-44 flex-none text-center">
                        {formatRupiah(parseFloat(item.display_price_sale))}
                      </div>
                      <div className="w-44 flex-none text-center">
                        {formatRupiah(parseFloat(item.purchase))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                    <div className="w-full flex-none text-center font-semibold">
                      No Data Viewed.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="annualy" className="w-full gap-4 flex flex-col">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <div className="w-full justify-between items-center flex mb-5">
              <h2 className="text-xl font-bold">Analytic Sale Annualy</h2>
              <div className="flex gap-2">
                <div className="flex">
                  <button
                    onClick={() =>
                      setYearCurrent(dataAnnualy?.year.prev_year.year)
                    }
                    className="px-3 h-10 py-1 border rounded-l flex gap-3 items-center font-semibold border-gray-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setYearCurrent(dataAnnualy?.year.current_month.year)
                    }
                    className="px-3 h-10 py-1 border-y flex gap-3 items-center font-semibold border-gray-500"
                  >
                    <p>{dataAnnualy?.year.selected_year.year}</p>
                  </button>
                  <button
                    onClick={() =>
                      setYearCurrent(dataAnnualy?.year.next_year.year)
                    }
                    className="px-3 h-10 py-1 border rounded-r flex gap-3 items-center font-semibold border-gray-500"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => cookies.set("analitycSaleYear", "updated")}
                  className="w-10 h-10 flex items-center justify-center border border-l-none rounded border-gray-500 hover:bg-sky-100"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-[500px] w-full relative">
              {loadingYear ? (
                <div className="w-full h-full absolute top-0 left-0 bg-sky-500/15 backdrop-blur z-10 rounded flex justify-center items-center border border-sky-500">
                  <Loader className="w-7 h-7 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataAnnualy}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 30,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      vertical={false}
                      className="stroke-gray-200"
                      horizontalCoordinatesGenerator={(props) =>
                        props.height > 400
                          ? [40, 140, 220, 300, 380]
                          : [100, 200]
                      }
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#000"
                      label={{ fontSize: "10px", color: "#fff" }}
                      padding={{ left: 0, right: 0 }}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: "10px", height: "20px" }}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload, label }) => (
                        <ContentTooltipAnnualy
                          active={active}
                          payload={payload}
                          label={label}
                        />
                      )}
                    />
                    <Legend
                      margin={{ top: 50, bottom: 0, left: 0, right: 0 }}
                      content={<ContentLegendAnnualy />}
                    />
                    {Object.keys(colorMapAnnualy).map((key) => (
                      <Bar
                        stackId={"a"}
                        dataKey={key}
                        fill={colorMapAnnualy[key]}
                        key={key}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-1/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Total Category</p>
              {loadingYear ? (
                <Skeleton className="w-1/5 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {(
                    dataAnnualy?.annual_summary.total_all_category ?? "0"
                  ).toLocaleString()}
                </p>
              )}
            </div>
            <div className="w-2/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Display Price</p>
              {loadingYear ? (
                <Skeleton className="w-2/3 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {formatRupiah(
                    dataAnnualy?.annual_summary.total_display_price_sale
                  ) ?? "Rp 0"}
                </p>
              )}
            </div>
            <div className="w-2/5 p-5 bg-white rounded-md overflow-hidden shadow ">
              <p className="text-sm font-light">Sale Price</p>
              {loadingYear ? (
                <Skeleton className="w-2/5 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {formatRupiah(
                    dataAnnualy?.annual_summary.total_product_price_sale
                  ) ?? "Rp 0"}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center flex-col">
            <div className="w-full flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                List Product Per-Category
              </h3>
              <div className="w-full flex justify-between items-center">
                <div
                  className="flex items-center gap-5"
                  style={{ width: "60%" }}
                >
                  <div className="relative w-full flex items-center mb-0">
                    <Label className="absolute left-3" htmlFor="search">
                      <Search className="w-4 h-4" />
                    </Label>
                    <input
                      id="search"
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                      className="w-full h-9 rounded outline-none px-10 text-xs border border-gray-500"
                    />
                    <button
                      onClick={clearSearch}
                      className={cn(
                        "h-5 w-5 absolute right-2 items-center justify-center outline-none",
                        dataSearch.length > 0 ? "flex" : "hidden"
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex border border-gray-500 rounded flex-none h-9 overflow-hidden">
                    <button
                      className={cn(
                        "w-9 h-full flex items-center justify-center outline-none",
                        layout === "list" ? "bg-sky-300" : "bg-transparent"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCurrentId(searchValue, "list");
                      }}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                      className={cn(
                        "w-9 h-full flex items-center justify-center outline-none",
                        layout === "grid" ? "bg-sky-300" : "bg-transparent"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCurrentId(searchValue, "grid");
                      }}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {layout === "grid" ? (
              <div className="grid grid-cols-4 gap-4 w-full">
                {searchValue ? (
                  dataAnnualy?.list_analytic_sale.filter((item: any) =>
                    item.product_category_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ).length > 0 ? (
                    dataAnnualy?.list_analytic_sale
                      .filter((item: any) =>
                        item.product_category_sale
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((item: any, i: any) => (
                        <div
                          key={item.code_document_sale}
                          className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                        >
                          <div className="flex w-full items-center gap-4">
                            <p className="text-sm font-bold text-black w-full">
                              {item.product_category_sale}
                            </p>
                            <div className="flex flex-col justify-center flex-none relative w-10 h-10 items-center group">
                              <p className="w-full h-full bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full z-20">
                                {item.total_category}
                              </p>
                              <p className="text-xs font-bold absolute transition-all group-hover:-translate-x-8 px-0 group-hover:pr-3 group-hover:pl-2 h-5 bg-white rounded-l-full z-10 group-hover:h-7 flex items-center justify-center group-hover:border">
                                QTY
                              </p>
                            </div>
                          </div>
                          <div className="w-full h-[1px] bg-gray-500 my-2" />
                          <div className="flex flex-col">
                            <p className="text-xs font-light text-gray-500">
                              Display Price
                            </p>
                            <p className="text-sm font-light text-gray-800">
                              {formatRupiah(item.display_price_sale)}
                            </p>
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-xs font-light text-gray-500">
                              Sale Price
                            </p>
                            <p className="text-sm font-light text-gray-800">
                              {formatRupiah(item.purchase)}
                            </p>
                          </div>
                          <p className="absolute text-end text-[100px] font-bold -bottom-8 right-2 text-gray-300/40 z-0">
                            {i + 1}
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                      <div className="w-full flex-none text-center font-semibold">
                        No Data Viewed.
                      </div>
                    </div>
                  )
                ) : dataAnnualy?.list_analytic_sale.length > 0 ? (
                  dataAnnualy?.list_analytic_sale.map((item: any, i: any) => (
                    <div
                      key={item.code_document_sale}
                      className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                    >
                      <div className="flex w-full items-center gap-4">
                        <p className="text-sm font-bold text-black w-full">
                          {item.product_category_sale}
                        </p>
                        <div className="flex flex-col justify-center flex-none relative w-10 h-10 items-center group">
                          <p className="w-full h-full bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full z-20">
                            {item.total_category}
                          </p>
                          <p className="text-xs font-bold absolute transition-all group-hover:-translate-x-8 px-0 group-hover:pr-3 group-hover:pl-2 h-5 bg-white rounded-l-full z-10 group-hover:h-7 flex items-center justify-center group-hover:border">
                            QTY
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-[1px] bg-gray-500 my-2" />
                      <div className="flex flex-col">
                        <p className="text-xs font-light text-gray-500">
                          Display Price
                        </p>
                        <p className="text-sm font-light text-gray-800">
                          {formatRupiah(item.display_price_sale)}
                        </p>
                      </div>
                      <div className="flex flex-col  mt-2">
                        <p className="text-xs font-light text-gray-500">
                          Sale Price
                        </p>
                        <p className="text-sm font-light text-gray-800">
                          {formatRupiah(item.purchase)}
                        </p>
                      </div>
                      <p className="absolute text-end text-[100px] font-bold -bottom-8 right-2 text-gray-300/40 z-0">
                        {i + 1}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                    <div className="w-full flex-none text-center font-semibold">
                      No Data Viewed.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full text-sm">
                <div className="w-full flex items-center h-10 px-5 gap-4 bg-sky-300 rounded">
                  <div className="w-10 font-semibold flex-none text-center">
                    No
                  </div>
                  <div className="w-full min-w-72 text-center font-semibold">
                    Category Name
                  </div>
                  <div className="w-28 flex-none text-center font-semibold">
                    Quantity
                  </div>
                  <div className="w-44 flex-none text-center font-semibold">
                    Display Price
                  </div>
                  <div className="w-44 flex-none text-center font-semibold">
                    Sale Price
                  </div>
                </div>
                {searchValue ? (
                  dataAnnualy?.list_analytic_sale.filter((item: any) =>
                    item.product_category_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ).length > 0 ? (
                    dataAnnualy?.list_analytic_sale
                      .filter((item: any) =>
                        item.product_category_sale
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((item: any, i: any) => (
                        <div
                          key={item.product_category_sale}
                          className="w-full flex items-center h-10 px-5 gap-4 hover:border-sky-500 border-b border-sky-200"
                        >
                          <div className="w-10 flex-none text-center">
                            {i + 1}
                          </div>
                          <div className="w-full min-w-72 text-start">
                            {item.product_category_sale}
                          </div>
                          <div className="w-28 flex-none text-center">
                            {item.total_category}
                          </div>
                          <div className="w-44 flex-none text-center">
                            {formatRupiah(parseFloat(item.display_price_sale))}
                          </div>
                          <div className="w-44 flex-none text-center">
                            {formatRupiah(parseFloat(item.purchase))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                      <div className="w-full flex-none text-center font-semibold">
                        No Data Viewed.
                      </div>
                    </div>
                  )
                ) : dataAnnualy?.list_analytic_sale.length > 0 ? (
                  dataAnnualy?.list_analytic_sale.map((item: any, i: any) => (
                    <div
                      key={item.product_category_sale}
                      className="w-full flex items-center h-10 px-5 gap-4 hover:border-sky-500 border-b border-sky-200"
                    >
                      <div className="w-10 flex-none text-center">{i + 1}</div>
                      <div className="w-full min-w-72 text-start">
                        {item.product_category_sale}
                      </div>
                      <div className="w-28 flex-none text-center">
                        {item.total_category}
                      </div>
                      <div className="w-44 flex-none text-center">
                        {formatRupiah(parseFloat(item.display_price_sale))}
                      </div>
                      <div className="w-44 flex-none text-center">
                        {formatRupiah(parseFloat(item.purchase))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex justify-center col-span-4 items-center px-5 py-10 hover:border-sky-500 border-b border-sky-200">
                    <div className="w-full flex-none text-center font-semibold">
                      No Data Viewed.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
