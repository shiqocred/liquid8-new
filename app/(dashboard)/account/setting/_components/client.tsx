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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Edit2,
  PackageOpen,
  PlusCircle,
  ReceiptText,
  Trash2,
  UserPlus2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";

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
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // const fetchCategory = useCallback(
  //   async (page: number, search: string) => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${baseUrl}/product_byCategory?page=${page}&q=${search}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`, // Menambahkan header Authorization
  //           },
  //         }
  //       );
  //       setCategory(response.data.data.resource.data);
  //     } catch (err: any) {
  //       setError(err.message || "An error occurred");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [accessToken]
  // );

  // useEffect(() => {
  //   if (accessToken) {
  //     fetchCategory(page, searchValue);
  //   }
  // }, [searchValue, page, fetchCategory, accessToken]);

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
          url: "/account/setting",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "Loading...";
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Account</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-5 flex-col">
        <h2 className="text-xl font-bold">Role Account</h2>
        <ul className="w-full p-4 rounded-md border border-sky-400/80 grid grid-cols-4 gap-2">
          <li>1 - Admin</li>
          <li>2 - Spv</li>
          <li>3 - Team Leader</li>
          <li>4 - Crew</li>
          <li>5 - Admin Kasir</li>
          <li>6 - Reparasi</li>
          <li>7 - Developer</li>
        </ul>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Accounts</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex gap-4">
              <Button
                className="bg-sky-300 hover:bg-sky-300/80 text-black"
                onClick={() => alert("pop up")}
                type="button"
              >
                <UserPlus2 className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-full min-w-72">Name</p>
                <p className="w-44 flex-none">Role</p>
                <p className="w-52 text-center flex-none">Action</p>
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <p className="w-10 text-center flex-none">{i + 1}</p>
                  <p className="w-full min-w-72 whitespace-pre-wrap">
                    Achmad Rifai
                  </p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    Admin Kasir
                  </p>
                  <div className="w-52 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center border-yellow-700 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-100"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <p>Edit</p>
                    </Button>
                    <Button
                      className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <p>Delete</p>
                    </Button>
                  </div>
                </div>
              ))}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">Page {page} of 3</p>
            <div className="flex items-center gap-2">
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
