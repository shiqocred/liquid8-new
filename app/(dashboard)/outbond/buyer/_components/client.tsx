"use client";

import {
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Trash2,
  UserPlus2,
} from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Loading from "../loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { baseUrl } from "@/lib/baseUrl";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah } from "@/lib/utils";

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
          url: "/outbond/buyer",
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
    return <Loading />;
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
          <BreadcrumbItem>Outbond</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Buyer</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Buyer</h2>
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
                Add Buyer
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-full min-w-72">Buyer Name</p>
                <p className="w-36 flex-none">Phone Number</p>
                <p className="w-24 flex-none">Transaction</p>
                <p className="w-44 flex-none">Purchase</p>
                <p className="w-52 text-center flex-none">Action</p>
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <p className="w-10 text-center flex-none">{i + 1}</p>
                  <p className="w-full min-w-72 whitespace-pre-wrap">
                    SIKAT GIGI PALET 2
                  </p>
                  <p className="w-36 flex-none whitespace-pre-wrap">
                    082228282288
                  </p>
                  <p className="w-24 flex-none whitespace-pre-wrap">1</p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    {formatRupiah(5500000000)}
                  </p>
                  <div className="w-52 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center border-sky-700 text-sky-700 hover:text-sky-700 hover:bg-sky-100"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <ReceiptText className="w-4 h-4 mr-1" />
                      <p>Detail</p>
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
