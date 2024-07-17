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
import { cn } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  ReceiptText,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";

export const Client = () => {
  const [isFilterCheck, setIsFilterCheck] = useState(false);
  const [isFilterApprove, setIsFilterApprove] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterCheck, setFilterCheck] = useState(searchParams.get("f") ?? "");
  const [filterApprove, setFilterApprove] = useState(
    searchParams.get("f") ?? ""
  );

  const handleCurrentId = useCallback(
    (q: string, fc: string, fa: string) => {
      setFilterCheck(fc);
      setFilterApprove(fa);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        fc: fc,
        fa: fa,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!fc || fc === "") {
        delete updateQuery.fc;
        setFilterCheck("");
      }
      if (!fa || fa === "") {
        delete updateQuery.fa;
        setFilterApprove("");
      }

      const url = qs.stringifyUrl(
        {
          url: "/inbound/check-history/",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, filterCheck, filterApprove);
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
          <BreadcrumbItem>Check History</BreadcrumbItem>
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
              <Popover open={isFilterCheck} onOpenChange={setIsFilterCheck}>
                <PopoverTrigger asChild>
                  <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                    <CircleFadingPlus className="h-4 w-4 mr-2" />
                    Status Check
                    {filterCheck && (
                      <Separator
                        orientation="vertical"
                        className="mx-2 bg-gray-500 w-[1.5px]"
                      />
                    )}
                    {filterCheck && (
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                          filterCheck === "pending" &&
                            "bg-gray-200 hover:bg-gray-200",
                          filterCheck === "in-progress" &&
                            "bg-yellow-400 hover:bg-yellow-400",
                          filterCheck === "done" &&
                            "bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {filterCheck === "pending" && "Pending"}
                        {filterCheck === "in-progress" && "In Progress"}
                        {filterCheck === "done" && "Done"}
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
                              "pending",
                              filterApprove
                            );
                            setIsFilterCheck(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterCheck === "pending"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                "pending",
                                filterApprove
                              );
                              setIsFilterCheck(false);
                            }}
                          />
                          Pending
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(
                              dataSearch,
                              "in-progress",
                              filterApprove
                            );
                            setIsFilterCheck(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterCheck === "in-progress"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                "in-progress",
                                filterApprove
                              );
                              setIsFilterCheck(false);
                            }}
                          />
                          In Progress
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "done", filterApprove);
                            setIsFilterCheck(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterCheck === "done"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                "done",
                                filterApprove
                              );
                              setIsFilterCheck(false);
                            }}
                          />
                          Done
                        </CommandItem>
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover open={isFilterApprove} onOpenChange={setIsFilterApprove}>
                <PopoverTrigger asChild>
                  <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                    <CircleFadingPlus className="h-4 w-4 mr-2" />
                    Status Approve
                    {filterApprove && (
                      <Separator
                        orientation="vertical"
                        className="mx-2 bg-gray-500 w-[1.5px]"
                      />
                    )}
                    {filterApprove && (
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                          filterApprove === "pending" &&
                            "bg-gray-200 hover:bg-gray-200",
                          filterApprove === "in-progress" &&
                            "bg-yellow-400 hover:bg-yellow-400",
                          filterApprove === "done" &&
                            "bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {filterApprove === "pending" && "Pending"}
                        {filterApprove === "in-progress" && "In Progress"}
                        {filterApprove === "done" && "Done"}
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
                            handleCurrentId(dataSearch, filterCheck, "pending");
                            setIsFilterApprove(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterApprove === "pending"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                filterCheck,
                                "pending"
                              );
                              setIsFilterApprove(false);
                            }}
                          />
                          Pending
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(
                              dataSearch,
                              filterCheck,
                              "in-progress"
                            );
                            setIsFilterApprove(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterApprove === "in-progress"}
                            onCheckedChange={() => {
                              handleCurrentId(
                                dataSearch,
                                filterCheck,
                                "in-progress"
                              );
                              setIsFilterApprove(false);
                            }}
                          />
                          In Progress
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, filterCheck, "done");
                            setIsFilterApprove(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filterApprove === "done"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, filterCheck, "done");
                              setIsFilterApprove(false);
                            }}
                          />
                          Done
                        </CommandItem>
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {(filterCheck || filterApprove) && (
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
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="xl:w-40 w-32 flex-none">Document Code</p>
              <p className="xl:w-44 w-36 flex-none">Date</p>
              <p className="xl:w-24 w-20 flex-none">Total Data</p>
              <p className="xl:w-24 w-20 flex-none">Total In</p>
              <p className="w-28 flex-none">Status Check</p>
              <p className="w-32 flex-none">Status Approved</p>
              <p className="w-full text-center">Action</p>
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <p className="xl:w-40 w-32 flex-none">0062/07/2024</p>
                <p className="xl:w-44 w-36 flex-none">Rabu, 10-07-2024</p>
                <p className="xl:w-24 w-20 flex-none">
                  {(2600).toLocaleString()}
                </p>
                <p className="xl:w-24 w-20 flex-none">
                  {(2600).toLocaleString()}
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
                <div className="w-32 flex-none">
                  <Badge
                    className={cn(
                      "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-gray-200 hover:bg-gray-200"
                    )}
                  >
                    Pending
                  </Badge>
                </div>
                <div className="w-full flex gap-4 justify-center">
                  <Link
                    href={"/inbound/check-history/1"}
                    className="xl:w-full w-9"
                  >
                    <TooltipProviderPage
                      value={<p>Detail</p>}
                      className="xl:hidden"
                    >
                      <Button
                        className="items-center w-full px-0 xl:px-4 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <ReceiptText className="w-4 h-4 xl:mr-1" />
                        <p className="hidden xl:flex">Detail</p>
                      </Button>
                    </TooltipProviderPage>
                  </Link>
                  <TooltipProviderPage
                    value={<p>Delete</p>}
                    className="xl:hidden"
                  >
                    <Button
                      className="items-center xl:w-full w-9 px-0 xl:px-4 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                      variant={"outline"}
                    >
                      <Trash2 className="w-4 h-4 xl:mr-1" />
                      <div className="hidden xl:flex">Delete</div>
                    </Button>
                  </TooltipProviderPage>
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
