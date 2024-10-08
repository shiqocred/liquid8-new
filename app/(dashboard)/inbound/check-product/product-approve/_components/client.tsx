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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatDate } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Combine,
  Loader,
  ReceiptText,
  RefreshCcw,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Loading from "../loading";

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/documentInProgress?page=${page}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
          url: "/inbound/check-product/product-approve",
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
    if (cookies.get("productApprove")) {
      fetchDocuments();
      return cookies.remove("productApprove");
    }
  }, [cookies.get("productApprove")]);

  useEffect(() => {
    setIsMounted(true);
    fetchDocuments();
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
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Product Approve</BreadcrumbItem>
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
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("productApprove", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                variant={"outline"}
              >
                <RefreshCw
                  className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                />
              </Button>
            </TooltipProviderPage>
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
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-36 flex-none">Document Code</p>
                  <p className="w-full min-w-72 max-w-[500px]">Base Document</p>
                  <p className="w-24 flex-none">Total</p>
                  <p className="w-28 flex-none">Status</p>
                  <p className="w-36 flex-none text-center">Action</p>
                </div>
                {data.map((item, i) => (
                  <div
                    className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                    key={item.id}
                  >
                    <p className="w-10 text-center flex-none">
                      {page.from + i}
                    </p>
                    <p className="w-36 flex-none">{item.code_document}</p>
                    <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.base_document}
                    </p>
                    <p className="w-24 flex-none">
                      {item.total_column_in_document.toLocaleString()}
                    </p>
                    <div className="w-28 flex-none">
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                          item.status_document === "pending" &&
                            "bg-gray-200 hover:bg-gray-200",
                          item.status_document === "in progress" &&
                            "bg-yellow-400 hover:bg-yellow-400",
                          item.status_document === "done" &&
                            "bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {item.status_document}
                      </Badge>
                    </div>
                    <div className="w-36 flex gap-4 justify-center">
                      <TooltipProviderPage value={<p>To Partial Stagging</p>}>
                        <Button
                          className="items-center w-9 px-0 flex-none h-9 border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                          variant={"outline"}
                        >
                          <Combine className="w-4 h-4" />
                        </Button>
                      </TooltipProviderPage>
                      <Link
                        href={`/inbound/check-product/product-approve/${item.id}`}
                        className="w-9"
                      >
                        <TooltipProviderPage value={<p>Detail</p>}>
                          <Button
                            className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                          >
                            <ReceiptText className="w-4 h-4" />
                          </Button>
                        </TooltipProviderPage>
                      </Link>
                      <TooltipProviderPage value={<p>Delete</p>}>
                        <Button
                          className="items-center w-9 px-0 flex-none h-9 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                          variant={"outline"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipProviderPage>
                    </div>
                  </div>
                ))}
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
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
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
