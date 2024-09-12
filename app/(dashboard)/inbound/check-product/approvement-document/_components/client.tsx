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
import { baseUrl } from "@/lib/baseUrl";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  ReceiptText,
  ShieldCheck,
  Trash2,
  Trash2Icon,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";

interface ApprocedProduct {
  id: string;
  code_document: string;
  base_document: string;
  date_document: string;
  total_column_in_document: number;
  status_document: "pending" | "in progress" | "done";
}

export const Client = () => {
  const { onOpen } = useModal();
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [listApproved, setListApproved] = useState<ApprocedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get('accessToken');

  const listApprovedProduct = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/documentInProgress?page=${page}&q=${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setListApproved(response.data.data.resource.data);
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
      listApprovedProduct(page, searchValue);
    }
  }, [searchValue, page, listApprovedProduct, accessToken]);

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
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }

      const url = qs.stringifyUrl(
        {
          url: "/inbound/check-product/approvement-product",
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
          <BreadcrumbItem>Approvement Product</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Approved Document</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex items-center gap-3">
              <Popover open={isFilter} onOpenChange={setIsFilter}>
                <PopoverTrigger asChild>
                  <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                    <CircleFadingPlus className="h-4 w-4 mr-2" />
                    Status
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
                          filter === "pending" &&
                            "bg-gray-200 hover:bg-gray-200",
                          filter === "in-progress" &&
                            "bg-yellow-400 hover:bg-yellow-400",
                          filter === "done" && "bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {filter === "pending" && "Pending"}
                        {filter === "in-progress" && "In Progress"}
                        {filter === "done" && "Done"}
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
                            handleCurrentId(dataSearch, "pending");
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "pending"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "pending");
                              setIsFilter(false);
                            }}
                          />
                          Pending
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "in-progress");
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "in-progress"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "in-progress");
                              setIsFilter(false);
                            }}
                          />
                          In Progress
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "done");
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "done"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "done");
                              setIsFilter(false);
                            }}
                          />
                          Done
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
                    handleCurrentId(dataSearch, "");
                  }}
                >
                  Reset
                  <XCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-36 xl:44 flex-none">Document Code</p>
              <p className="w-full">Base Document</p>
              <p className="w-32 flex-none">Approved Data</p>
              <p className="w-28 flex-none">Status</p>
              <p className="xl:w-48 w-28 text-center flex-none">Action</p>
            </div>
            {listApproved.length > 0 ? (
              listApproved.map((product, index) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                  key={product.id}
                >
                  <p className="w-10 text-center flex-none">{index + 1}</p>
                  <p className="w-36 xl:44 flex-none overflow-hidden text-ellipsis">
                    {product.code_document}
                  </p>
                  <p className="w-full overflow-hidden text-ellipsis">
                    {product.base_document}
                  </p>
                  <p className="w-32 flex-none overflow-hidden text-ellipsis">
                    {product.total_column_in_document}
                  </p>
                  <div className="w-28 flex-none">
                    <Badge
                      className={cn(
                        "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                        product.status_document === "pending" &&
                          "bg-gray-200 hover:bg-gray-200",
                        product.status_document === "in progress" &&
                          "bg-yellow-400 hover:bg-yellow-400",
                        product.status_document === "done" &&
                          "bg-green-400 hover:bg-green-400"
                      )}
                    >
                      {product.status_document === "pending" && "Pending"}
                      {product.status_document === "in progress" &&
                        "In Progress"}
                      {product.status_document === "done" && "Done"}
                    </Badge>
                  </div>
                  <div className="xl:w-48 w-28 flex-none flex gap-4 justify-center">
                    {/* <Button
                      className="items-center xl:w-full w-9 px-0 xl:px-4 border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => onOpen("approve-documents", product.id)}
                    >
                      <ShieldCheck className="w-4 h-4 xl:mr-1" />
                      <p className="hidden xl:flex">Approve</p>
                    </Button> */}
                    <Link
                      href={`/inbound/check-product/approvement-product/${product.code_document}`}
                      className="xl:w-full w-9"
                      onClick={() => {
                      const approvementDocumentData = {
                        base_document: product.base_document,
                        total_column_in_document: product.total_column_in_document,
                        status_document: product.status_document,
                        code_document: product.code_document,
                      };
                      localStorage.setItem(
                        "approvementDocumentData",
                        JSON.stringify(approvementDocumentData)
                      );
                    }}
                    >
                      <Button
                        className="items-center w-full px-0 xl:px-4 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <ReceiptText className="w-4 h-4 xl:mr-1" />
                        <p className="hidden xl:flex">Detail</p>
                      </Button>
                    </Link>
                    <Button
                      className="items-center xl:w-full px-0 xl:px-4 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 w-9"
                      variant={"outline"}
                      type="button"
                      onClick={() => onOpen("delete-manifest-inbound", product.id)}
                    >
                      <Trash2 className="w-4 h-4 xl:mr-1" />
                      <p className="hidden xl:flex">Delete</p>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-full py-5">
                No approved documents found.
              </p>
            )}
            {/* {Array.from({ length: 5 }, (_, i) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <p className="w-36 xl:44 flex-none overflow-hidden text-ellipsis">
                  0062/07/2024
                </p>
                <p className="w-full overflow-hidden text-ellipsis">
                  JNT 09.07.2024.xlsx
                </p>
                <p className="w-32 flex-none overflow-hidden text-ellipsis">
                  3454
                </p>
                <div className="w-28 flex-none">
                  <Badge
                    className={cn(
                      "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-gray-200 hover:bg-gray-200"
                    )}
                  >
                    Pending
                  </Badge>
                </div>
                <div className="xl:w-48 w-28 flex-none flex gap-4 justify-center">
                  <Button
                    className="items-center xl:w-full w-9 px-0 xl:px-4 border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                    variant={"outline"}
                    type="button"
                    onClick={() => onOpen("approve-documents", "id")}
                  >
                    <Trash2 className="w-4 h-4 xl:mr-1" />
                    <p className="hidden xl:flex">Approve</p>
                  </Button>
                  <Link
                    href={"/inbound/check-product/approvement-product/1"}
                    className="xl:w-full w-9"
                  >
                    <Button
                      className="items-center w-full px-0 xl:px-4 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                      variant={"outline"}
                    >
                      <ReceiptText className="w-4 h-4 xl:mr-1" />
                      <p className="hidden xl:flex">Detail</p>
                    </Button>
                  </Link>
                </div>
              </div>
            ))} */}
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
