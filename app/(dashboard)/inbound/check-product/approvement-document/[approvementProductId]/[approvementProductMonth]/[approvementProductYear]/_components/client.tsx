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
import { baseUrl } from "@/lib/baseUrl";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading";

interface DetailApprovementProduct {
  id: string;
  code_document: string;
  old_barcode_product: string;
  new_barcode_product: string;
  new_name_product: string;
  new_quantity_product: number;
  new_price_product: string;
  old_price_product: string;
  new_date_in_product: string;
  new_status_product: string;
  new_quality: string;
  new_category_product: string;
  new_tag_product: string;
  created_at: string;
  updated_at: string;
  new_discount: string;
  display_price: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [orientation, setOrientation] = useState(searchParams.get("s") ?? "");
  const params = useParams();
  const [dataResults, setDataResults] = useState<DetailApprovementProduct[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

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
          url: `/inbound/check-product/approvement-document/${params.approvementProductId}/${params.approvementProductMonth}/${params.approvementProductYear}`,
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

  const [approvementDocumentData, setApprovementDocumentData] = useState({
    base_document: "",
    total_column_in_document: 0,
    status_document: "",
    code_document: "",
  });

  useEffect(() => {
    const ApprovementDocumentData = localStorage.getItem(
      "approvementDocumentData"
    );
    if (ApprovementDocumentData) {
      setApprovementDocumentData(JSON.parse(ApprovementDocumentData));
    }
  }, []);

  const fetchListDetailApprovementProduct = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      const codeDocument = `${params.approvementProductId}/${params.approvementProductMonth}/${params.approvementProductYear}`;
      try {
        const response = await axios.get(
          `${baseUrl}/product-approveByDoc/${codeDocument}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataResults(response.data.data.resource);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      fetchListDetailApprovementProduct(page, searchValue);
    }
  }, [
    searchValue,
    page,
    fetchListDetailApprovementProduct,
    params,
    accessToken,
  ]);

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
            <BreadcrumbLink href="/inbound/check-product/approvement-product">
              Approvement Product
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-8 rounded-md shadow bg-white w-full px-5">
        <div className="w-full text-xs flex items-center">
          <Link
            href={"/inbound/check-product/approvement-product"}
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
            <h3 className="text-black font-semibold text-xl">
              {approvementDocumentData.base_document}
            </h3>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col items-end w-2/4 border-r border-gray-500 pr-5 mr-5 overflow-hidden text-ellipsis">
            <p>Code Documents</p>
            <h3 className="text-gray-700 font-semibold text-xl">
              {approvementDocumentData.code_document}
            </h3>
          </div>
          <div className="flex flex-col items-end w-1/4 border-r border-gray-700 pr-5 mr-5">
            <p>Status</p>
            <h3 className="text-gray-700 font-semibold text-xl">
              {approvementDocumentData.status_document}
            </h3>
          </div>
          <div className="flex flex-col items-end w-1/4">
            <p>Approvement Data</p>
            <h3 className="text-gray-700 font-semibold text-xl">
              {approvementDocumentData.total_column_in_document}
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
              <div className="flex items-center justify-start w-full">
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
                              "rounded w-24 px-0 justify-center text-black font-normal capitalize",
                              filter === "old-barcode" &&
                                "bg-sky-200 hover:bg-sky-200",
                              filter === "new-barcode" &&
                                "bg-indigo-200 hover:bg-indigo-200",
                              filter === "name" &&
                                "bg-green-200 hover:bg-green-200"
                            )}
                          >
                            {filter === "old-barcode" && "Old Barcode"}
                            {filter === "new-barcode" && "New Barcode"}
                            {filter === "name" && "Name"}
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
                                handleCurrentId(
                                  dataSearch,
                                  "old-barcode",
                                  "asc"
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "old-barcode" &&
                                  orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "old-barcode",
                                    "asc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Old Barcode
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(
                                  dataSearch,
                                  "old-barcode",
                                  "desc"
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "old-barcode" &&
                                  orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "old-barcode",
                                    "desc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              Old Barcode
                              <CommandShortcut>desc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(
                                  dataSearch,
                                  "new-barcode",
                                  "asc"
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "new-barcode" &&
                                  orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "new-barcode",
                                    "asc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              New Barcode
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(
                                  dataSearch,
                                  "new-barcode",
                                  "desc"
                                );
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "new-barcode" &&
                                  orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(
                                    dataSearch,
                                    "new-barcode",
                                    "desc"
                                  );
                                  setIsFilter(false);
                                }}
                              />
                              New Barcode
                              <CommandShortcut>desc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "name", "asc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "name" && orientation === "asc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "name", "asc");
                                  setIsFilter(false);
                                }}
                              />
                              Name
                              <CommandShortcut>asc</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                handleCurrentId(dataSearch, "name", "desc");
                                setIsFilter(false);
                              }}
                            >
                              <Checkbox
                                className="w-4 h-4 mr-2"
                                checked={
                                  filter === "name" && orientation === "desc"
                                }
                                onCheckedChange={() => {
                                  handleCurrentId(dataSearch, "name", "desc");
                                  setIsFilter(false);
                                }}
                              />
                              Name
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
              </div>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-36 flex-none">Old Barcode</p>
              <p className="w-36 flex-none">New Barcode</p>
              <p className="w-full text-center">Name</p>
              <p className="w-28 flex-none">Status</p>
              <p className="xl:w-48 w-28 flex-none text-center">Action</p>
            </div>
            {dataResults.map((product, index) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                key={product.id}
              >
                <p className="w-10 text-center flex-none">{index + 1}</p>
                <div className="w-36 flex-none flex items-center">
                  <p>{product.old_barcode_product}</p>
                </div>
                <p className="w-36 flex-none">{product.new_barcode_product}</p>
                <p className="w-full text-start">{product.new_name_product}</p>
                <div className="w-28 flex-none">
                  <span
                    className={`px-3 py-0.5 rounded ${
                      product.new_status_product === "display"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    {product.new_status_product}
                  </span>
                </div>
                <div className="xl:w-48 w-28 flex-none flex justify-center gap-4">
                  <Button
                    className="items-center xl:w-full w-9 px-0 xl:px-4 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                    variant={"outline"}
                    type="button"
                    onClick={() => alert("pop up")}
                  >
                    <ReceiptText className="w-4 h-4 xl:mr-1" />
                    <p className="hidden xl:flex">Detail</p>
                  </Button>
                  <Button
                    className="items-center xl:w-full w-9 px-0 xl:px-4 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                    variant={"outline"}
                    type="button"
                    onClick={() => alert("pop up")}
                  >
                    <Trash2 className="w-4 h-4 xl:mr-1" />
                    <div className="hidden xl:flex">Delete</div>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">Page 1 of 3</p>
            <div className="flex items-center gap-2">
              <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
