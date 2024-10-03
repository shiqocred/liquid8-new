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
  Eye,
  EyeOff,
  FileDown,
  LayoutGrid,
  LayoutList,
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

interface ChartData {
  date: string;
  total_price_sale: number;
  total_display_price: number;
}

const ContentLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex w-full justify-center gap-x-6 items-center text-xs">
      {payload.map((item: any) => (
        <div key={item.id} className="flex gap-x-2 items-center capitalize">
          <div
            className={cn(
              "h-2 w-3 rounded",
              item.value === "total_display_price" && "bg-red-500",
              item.value === "total_price_sale" && "bg-sky-500"
            )}
          />
          {item.value === "total_price_sale" && "Sale Price"}
        </div>
      ))}
    </ul>
  );
};

const ContentTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean | undefined;
  payload: any;
  label: string;
}) => {
  if (active && payload && label) {
    return (
      <div className="bg-white rounded px-3 py-1.5 border text-xs dark:bg-gray-900 shadow-sm">
        <p className="text-sm font-bold">{label}</p>
        <div className="mb-2 bg-gray-500 dark:bg-gray-300 w-full h-[1px]" />
        <p>Sale Price: {formatRupiah(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isArea, setIsArea] = useState(false);
  const [isLine, setIsLine] = useState(true);
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
  const [chartData, setChartData] = useState<ChartData[]>([
    {
      date: "01-01-2024",
      total_price_sale: 0,
      total_display_price: 0,
    },
  ]);

  const [data, setData] = useState<any>();
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
  console.log(date);
  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setDate([selection]);
  };

  const getStorageReport = async () => {
    const from = date[0].startDate
      ? format(date[0].startDate, "dd-MM-yyyy")
      : "";
    const to = date[0].endDate ? format(date[0].endDate, "dd-MM-yyyy") : "";
    try {
      const res = await axios.get(
        `${baseUrl}/dashboard/general-sales?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChartData(res.data.data.resource.chart);
      setData(res.data.data.resource);
    } catch (error) {
      console.log(error);
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
          url: "/dashboard/general-sale",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, layout);
  }, [searchValue]);

  useEffect(() => {
    getStorageReport();
  }, [date]);

  useEffect(() => {
    getStorageReport();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <div className="w-full flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Storage Report</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center border px-3 py-1 border-gray-500 rounded-md">
          <Badge className="bg-sky-300 hover:bg-sky-300 text-black rounded-full">
            Development
          </Badge>
          <Button onClick={() => setIsArea(!isArea)}>
            {!isArea ? (
              <Eye className="w-4 h-4 mr-1" />
            ) : (
              <EyeOff className="w-4 h-4 mr-1" />
            )}
            Area Chart
          </Button>
          <Button onClick={() => setIsLine(!isLine)}>
            {!isLine ? (
              <Eye className="w-4 h-4 mr-1" />
            ) : (
              <EyeOff className="w-4 h-4 mr-1" />
            )}
            Line Chart
          </Button>
        </div>
      </div>
      {isLine && (
        <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
          <div className="w-full justify-between items-center flex mb-5">
            <h2 className="text-xl font-bold">General Sale</h2>
            <div className="flex gap-2">
              <div className="px-3 h-10 py-1 border rounded flex gap-3 items-center text-sm border-gray-500">
                <p>
                  {data?.month.current_month.month +
                    " " +
                    data?.month.current_month.year}
                </p>
                {data?.month.date_from.date !== null && (
                  <>
                    <p className="w-[1px] h-full bg-black" />
                    <p>
                      {data?.month.date_from.date +
                        " " +
                        data?.month.date_from.month +
                        " " +
                        data?.month.date_from.year +
                        " - " +
                        (data?.month.date_to.date +
                          " " +
                          data?.month.date_to.month +
                          " " +
                          data?.month.date_to.year)}
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
              <button className="w-10 h-10 flex items-center justify-center border border-l-none rounded border-gray-500 hover:bg-sky-100">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 30,
                  bottom: 5,
                }}
              >
                <YAxis hide />
                <XAxis
                  dataKey="date"
                  stroke="#000"
                  fontSize={12}
                  padding={{ left: 0, right: 0 }}
                  tickMargin={10}
                  style={{ fontSize: "10px" }}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => (
                    <ContentTooltip
                      active={active}
                      payload={payload}
                      label={label}
                    />
                  )}
                />
                <Legend content={<ContentLegend />} />
                <Line
                  type={"natural"}
                  dataKey="total_price_sale"
                  stroke="#0ea5e9"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {isArea && (
        <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
          <div className="w-full justify-between items-center flex mb-5">
            <h2 className="text-xl font-bold">General Sale</h2>
            <div className="flex gap-2">
              <div className="px-3 h-10 py-1 border rounded flex gap-3 items-center text-sm border-gray-500">
                <p>
                  {data?.month.current_month.month +
                    " " +
                    data?.month.current_month.year}
                </p>
                {data?.month.date_from.date !== null && (
                  <>
                    <p className="w-[1px] h-full bg-black" />
                    <p>
                      {data?.month.date_from.date +
                        " " +
                        data?.month.date_from.month +
                        " " +
                        data?.month.date_from.year +
                        " - " +
                        (data?.month.date_to.date +
                          " " +
                          data?.month.date_to.month +
                          " " +
                          data?.month.date_to.year)}
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
              <button className="w-10 h-10 flex items-center justify-center border border-l-none rounded border-gray-500 hover:bg-sky-100">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 30,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <YAxis hide />
                <XAxis
                  dataKey="date"
                  stroke="#000"
                  fontSize={12}
                  padding={{ left: 0, right: 0 }}
                  tickMargin={10}
                  style={{ fontSize: "10px" }}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => (
                    <ContentTooltip
                      active={active}
                      payload={payload}
                      label={label}
                    />
                  )}
                />
                <Legend content={<ContentLegend />} />
                <Area
                  type={"natural"}
                  dataKey="total_price_sale"
                  stroke="#0ea5e9"
                  fill="url(#fillColor)"
                  fillOpacity={0.4}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center flex-col">
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-lg font-semibold">List Product Per-Category</h3>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-5" style={{ width: "60%" }}>
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
            <Button className="bg-sky-300/80 hover:bg-sky-300 text-black">
              <FileDown className="w-4 h-4 mr-1" />
              Export Data
            </Button>
          </div>
        </div>
        {layout === "grid" ? (
          <div className="grid grid-cols-4 gap-4 w-full">
            {searchValue ? (
              data?.list_document_sale.filter((item: any) =>
                item.code_document_sale
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              ).length > 0 ? (
                data?.list_document_sale
                  .filter((item: any) =>
                    item.code_document_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((item: any, i: any) => (
                    <div
                      key={item.code_document_sale}
                      className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                    >
                      <div className="flex w-full items-center">
                        <div className="w-full flex flex-col">
                          <p className="text-sm font-light text-gray-500">
                            {item.code_document_sale}
                          </p>
                          <h3 className="text-gray-700 font-bold text-base">
                            {item.buyer_name_document_sale}
                          </h3>
                        </div>
                        <button
                          onClick={() => {}}
                          className="w-10 h-10 hover:bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </button>
                      </div>
                      <div className="w-full h-[1px] bg-gray-500 my-2" />
                      <div className="flex flex-col">
                        <p className="text-xs font-light text-gray-500">
                          Sale Price
                        </p>
                        <p className="text-sm font-light text-gray-800">
                          {formatRupiah(item.total_purchase)}
                        </p>
                      </div>
                      <p className="absolute text-end text-[100px] font-bold bottom-8 right-2 text-gray-300/20 z-0">
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
            ) : data?.list_document_sale.length > 0 ? (
              data?.list_document_sale.map((item: any, i: any) => (
                <div
                  key={item.code_document_sale}
                  className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 justify-center flex-col border border-transparent transition-all hover:border-sky-300 box-border relative"
                >
                  <div className="flex w-full items-center">
                    <div className="w-full flex flex-col">
                      <p className="text-sm font-light text-gray-500">
                        {item.code_document_sale}
                      </p>
                      <h3 className="text-gray-700 font-bold text-base">
                        {item.buyer_name_document_sale}
                      </h3>
                    </div>
                    <button
                      onClick={() => {}}
                      className="w-10 h-10 hover:bg-gray-100 transition-all flex flex-none items-center justify-center rounded-full"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full h-[1px] bg-gray-500 my-2" />
                  <div className="flex flex-col">
                    <p className="text-xs font-light text-gray-500">
                      Sale Price
                    </p>
                    <p className="text-sm font-light text-gray-800">
                      {formatRupiah(item.total_purchase)}
                    </p>
                  </div>
                  <p className="absolute text-end text-[60px] font-bold -bottom-4 right-3 text-gray-300/40 z-0">
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
              <div className="w-10 font-semibold flex-none text-center">No</div>
              <div className="w-44 flex-none text-center font-semibold">
                Code Document
              </div>
              <div className="w-full min-w-72 text-center font-semibold">
                Buyer Name
              </div>
              <div className="w-44 flex-none text-center font-semibold">
                Sale Price
              </div>
              <div className="w-44 flex-none text-center font-semibold">
                Option
              </div>
            </div>
            {searchValue ? (
              data?.list_document_sale.filter((item: any) =>
                item.code_document_sale
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              ).length > 0 ? (
                data?.list_document_sale
                  .filter((item: any) =>
                    item.code_document_sale
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((item: any, i: any) => (
                    <div
                      key={item.code_document_sale}
                      className="w-full flex items-center h-10 px-5 gap-2 hover:border-sky-500 border-b border-sky-200"
                    >
                      <div className="w-10 flex-none text-center">{i + 1}</div>
                      <div className="w-44 flex-none text-center">
                        {item.code_document_sale}
                      </div>
                      <div className="w-full min-w-72 text-start">
                        {item.buyer_name_document_sale}
                      </div>
                      <div className="w-44 flex-none text-center">
                        {formatRupiah(item.total_purchase)}
                      </div>
                      <div className="w-44 flex-none text-center">
                        <Button
                          onClick={() => {}}
                          className="bg-sky-300/80 hover:bg-sky-300 text-black h-6"
                        >
                          Detail
                        </Button>
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
            ) : data?.list_document_sale.length > 0 ? (
              data?.list_document_sale.map((item: any, i: any) => (
                <div
                  key={item.code_document_sale}
                  className="w-full flex items-center h-10 px-5 gap-2 hover:border-sky-500 border-b border-sky-200"
                >
                  <div className="w-10 flex-none text-center">{i + 1}</div>
                  <div className="w-44 flex-none text-center">
                    {item.code_document_sale}
                  </div>
                  <div className="w-full min-w-72 text-start">
                    {item.buyer_name_document_sale}
                  </div>
                  <div className="w-44 flex-none text-center">
                    {formatRupiah(item.total_purchase)}
                  </div>
                  <div className="w-44 flex-none text-center">
                    <Button
                      onClick={() => {}}
                      className="bg-sky-300/80 hover:bg-sky-300 text-black h-6"
                    >
                      Detail
                    </Button>
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
    </div>
  );
};
