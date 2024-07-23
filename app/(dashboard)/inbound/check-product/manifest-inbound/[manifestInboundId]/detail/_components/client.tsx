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
import { cn, formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import {
  ArrowLeft,
  ArrowRightCircle,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";

export const Client = () => {
  const { onOpen } = useModal();
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [orientation, setOrientation] = useState(searchParams.get("s") ?? "");
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000); // Reset the icon after 2 seconds
    });
  };

  const handleCurrentId = useCallback(
    (q: string, f: string, s: string) => {
      setFilter(f);
      setOrientation(s);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
        s: s,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }
      if (!s || s === "") {
        delete updateQuery.s;
        setOrientation("");
      }

      const url = qs.stringifyUrl(
        {
          url: `/inbound/check-product/manifest-inbound/${params.manifestInboundId}/detail`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, filter, orientation);
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "Loading...";
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
            <BreadcrumbLink href="/inbound/check-product/manifest-inbound/">
              Manifest Inbound
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-8 rounded-md shadow bg-white w-full px-5">
        <div className="w-full text-xs flex items-center">
          <Link
            href={"/inbound/check-product/manifest-inbound"}
            className="group"
          >
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
            <p>Data Name</p>
            <h3 className="text-black font-semibold text-xl">Tester.xlsx</h3>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col items-end w-1/4 border-r border-gray-500 pr-5 mr-5">
            <p>Status</p>
            <h3 className="text-gray-700 font-light text-xl">Pending</h3>
          </div>
          <div className="flex flex-col items-end w-2/4 border-r border-gray-700 pr-5 mr-5">
            <p>Merged Data</p>
            <h3 className="text-gray-700 font-light text-xl">0096/07/2024</h3>
          </div>
          <div className="flex flex-col items-end w-1/4">
            <p>Total</p>
            <h3 className="text-gray-700 font-light text-xl">
              {(3521).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">Detail Data Process</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full flex-auto">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Popover open={isFilter} onOpenChange={setIsFilter}>
                    <PopoverTrigger asChild>
                      <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort by
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
                              filter === "barcode" &&
                                "bg-sky-200 hover:bg-sky-200",
                              filter === "product" &&
                                "bg-indigo-200 hover:bg-indigo-200",
                              filter === "price" &&
                                "bg-green-200 hover:bg-green-200"
                            )}
                          >
                            {filter === "barcode" && "Barcode"}
                            {filter === "product" && "Product"}
                            {filter === "price" && "Price"}
                          </Badge>
                        )}
                        {orientation && (
                          <Badge
                            className={cn(
                              "rounded w-12 px-0 justify-center text-black font-normal lowercase ml-2",
                              orientation === "asc" &&
                                "bg-gray-200 hover:bg-gray-200",
                              orientation === "desc" &&
                                "bg-black hover:bg-black text-white"
                            )}
                          >
                            {orientation === "asc" && "asc"}
                            {orientation === "desc" && "desc"}
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
                                handleCurrentId(dataSearch, "barcode", "asc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "barcode" && orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "barcode", "asc");
                                  setIsFilter(false);
                                }}
                              />
                              Barcode
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "barcode", "desc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "barcode" && orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "barcode",
                                    "desc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Barcode
                              <CommandShortcut>desc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "product", "asc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "product" && orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "product", "asc");
                                  setIsFilter(false);
                                }}
                              />
                              Product
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "product", "desc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "product" && orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "product",
                                    "desc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Product
                              <CommandShortcut>desc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "price", "asc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "price" && orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "price", "asc");
                                  setIsFilter(false);
                                }}
                              />
                              Price
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "price", "desc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "price" && orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "price", "desc");
                                  setIsFilter(false);
                                }}
                              />
                              Price
                              <CommandShortcut>desc</CommandShortcut>
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
                        handleCurrentId(dataSearch, "", "");
                      }}
                    >
                      Reset
                      <XCircle className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <Link
                    href={`/inbound/check-product/manifest-inbound/${params.manifestInboundId}/check`}
                  >
                    <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                      <ArrowRightCircle className="w-4 h-4 mr-1" />
                      Next
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-52 flex-none">Resi Number</p>
              <p className="w-full">Product Name</p>
              <p className="w-24 text-center flex-none">QTY</p>
              <p className="w-28 flex-none">Price</p>
              <p className="xl:w-32 w-20 flex-none text-center">Action</p>
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <div className="w-52 flex-none flex items-center">
                  <p>NLIDAP1655193210</p>
                  <TooltipProviderPage
                    value={<p>{copied === i ? "Copied" : "Copy Barcode"}</p>}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy("NLIDAP1655193210", i);
                      }}
                      disabled={copied === i}
                    >
                      {copied === i ? (
                        <Check className="w-3 h-3 ml-2" />
                      ) : (
                        <Copy className="w-3 h-3 ml-2" />
                      )}
                    </button>
                  </TooltipProviderPage>
                </div>
                <p className="w-full">
                  Mainan Batang Blok Magnetik Set 130pcs Building Blocks
                  Montessori Edukasi Anak
                </p>
                <p className="w-24 text-center flex-none">1</p>
                <p className="w-28 flex-none">{formatRupiah(100000)}</p>
                <div className="xl:w-32 w-20 flex-none flex justify-center">
                  <Button
                    className="items-center xl:w-full w-9 px-0 xl:px-4 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                    variant={"outline"}
                    onClick={() =>
                      onOpen("delete-detail-manifest-inbound", "id")
                    }
                    type="button"
                  >
                    <Trash2 className="w-4 h-4 xl:mr-1" />
                    <div className="hidden xl:flex">Delete</div>
                  </Button>
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
