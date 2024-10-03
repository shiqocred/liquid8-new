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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
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
const chartData = [
  { dataType: "good", values: 275, fill: "var(--color-good)" },
  { dataType: "damaged", values: 200, fill: "var(--color-damaged)" },
  { dataType: "discrepancy", values: 287, fill: "var(--color-discrepancy)" },
  { dataType: "abnormal", values: 173, fill: "var(--color-abnormal)" },
];
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

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.values, 0);
  }, []);

  const handleCurrentId = useCallback(
    (q: string, f: string) => {
      setFilter(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }

      const url = qs.stringifyUrl(
        {
          url: `/inbound/check-history/${params.id}`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, filter);
  }, [searchValue]);

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
          <BreadcrumbItem>
            <BreadcrumbLink href="/inbound/check-history">
              Check History
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full gap-4">
        <div className="flex w-full flex-col gap-4">
          <div className="flex text-sm text-gray-500 py-3 rounded-md shadow bg-white w-full px-5 h-24 items-center">
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
              <div className="w-2/3">
                <p>Document Code</p>
                <h3 className="text-black font-semibold text-xl">
                  0062/07/2024
                </h3>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex flex-col w-full border-l pl-2 border-black gap-2 py-2">
                <h3 className="text-xs">Status Check</h3>
                <div>
                  <Badge className="rounded-full bg-green-400 text-black hover:bg-green-400">
                    Done
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col w-full border-l pl-2 border-black gap-2 py-2">
                <h3 className="text-xs">Status Approve</h3>
                <div>
                  <Badge className="rounded-full bg-green-400 text-black hover:bg-green-400">
                    Done
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 w-full gap-4">
            <div className="flex flex-col gap-4 col-span-2 xl:col-span-1">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">Total Data</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total Data In
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 col-span-2 xl:col-span-1">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total By Category
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total By Color
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 col-span-2 xl:col-span-1">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total Good Data
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total Damaged Data
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 col-span-2 xl:col-span-1">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total Abnormal Data
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-24 gap-2 flex-col">
                <p className="text-sm font-light text-gray-500">
                  Total Discrepancy Data
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 font-bold text-2xl">
                    {(2600).toLocaleString()}
                  </h3>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 col-span-2 xl:col-span-1 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total Price Good Data
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-2xl">
                  {formatRupiah(40546966)}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 col-span-2 xl:col-span-1 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total Price Damaged Data
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-2xl">
                  {formatRupiah(404225)}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 col-span-2 xl:col-span-1 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total Price Abnormal Data
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-2xl">
                  {formatRupiah(4326000)}
                </h3>
                <div>
                  <Badge className="rounded-full bg-transparent hover:bg-transparent text-black border border-black">
                    100%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 justify-center h-36 gap-4 col-span-2 xl:col-span-1 flex-col">
              <p className="text-sm font-light text-gray-500">
                Total Price Discrepancy Data
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-2xl">
                  {formatRupiah(55661885)}
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
        <div className="flex flex-col gap-4">
          <div className="flex h-[544px] xl:h-auto relative rounded-md shadow bg-white">
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
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center "
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          <div className="flex h-[304px] xl:h-auto relative rounded-md shadow bg-white">
            <div className="flex w-full px-5 justify-center h-36 gap-4 flex-col sticky top-0">
              <p className="text-sm font-light text-gray-500">Total Price</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-700 font-bold text-2xl">
                  {formatRupiah(100939076)}
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
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold capitalize">
          List Data <span className="underline">{filter}</span>
        </h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full flex-auto">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
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
                                handleCurrentId(dataSearch, "good");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "good"}
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "good");
                                  setIsFilter(false);
                                }}
                              />
                              Good
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(dataSearch, "damaged");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "damaged"}
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "damaged");
                                  setIsFilter(false);
                                }}
                              />
                              Damaged
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(dataSearch, "abnormal");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "abnormal"}
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "abnormal");
                                  setIsFilter(false);
                                }}
                              />
                              Abnormal
                            </CommandItem>
                            <CommandItem
                              onSelect={(e) => {
                                handleCurrentId(dataSearch, "discrepancy");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={filter === "discrepancy"}
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "discrepancy");
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
            <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-36 flex-none">Old Barcode</p>
              <p className="w-36 flex-none">New Barcode</p>
              <p className="w-full text-center">Name</p>
              <p className="w-8 text-center flex-none">Qty</p>
              <p className="w-40 flex-none text-center">Price</p>
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <div className="w-36 flex-none flex items-center">
                  <p>106000868w</p>
                </div>
                <p className="w-36 flex-none">LTJRDROR</p>
                <p className="w-full text-start">Lorem ipsum dolor sit amet.</p>
                <p className="w-8 text-center flex-none">1</p>
                <div className="w-40 flex-none flex justify-center gap-4">
                  {formatRupiah(10450000)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">Page 1 of 3</p>
            <div className="flex items-center gap-2">
              <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
