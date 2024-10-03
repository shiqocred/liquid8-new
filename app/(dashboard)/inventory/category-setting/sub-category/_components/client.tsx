"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatRupiah } from "@/lib/utils";
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
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  Edit2,
  Edit3,
  FileDown,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useCookies } from "next-client-cookies";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "../loading";

interface SettingCategory {
  id: number;
  name_category: string;
  discount_category: number;
  max_price_category: number;
  created_at: string;
  updated_at: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [settingCategory, setSettingCategory] = useState<SettingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const fetchSettingCategory = useCallback(
    async (search: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/categories?q=${search}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSettingCategory(response.data.data.resource);
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
      fetchSettingCategory(searchValue);
    }
  }, [searchValue, fetchSettingCategory, accessToken]);

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
          url: "/inventory/category-setting/sub-category",
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
  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Setting Sub Category</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Sub Categories</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex justify-between">
            <div className="flex gap-2 items-center w-full">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
            </div>
            <div className="flex gap-4">
              <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Button>
              <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                <FileDown className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="min-w-72 w-full">Category Name</p>
                <p className="w-28 flex-none">Discount</p>
                <p className="w-52 flex-none">Max. Price</p>
                <p className="w-48 text-center flex-none">Action</p>
              </div>
              {settingCategory.map((item, index) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={item.id}
                >
                  <p className="w-10 text-center flex-none">{index + 1}</p>
                  <p className="min-w-72 w-full text-ellipsis overflow-hidden whitespace-nowrap">
                    {item.name_category}
                  </p>
                  <p className="w-28 flex-none whitespace-pre-wrap">
                    {item.discount_category}%
                  </p>
                  <p className="w-52 flex-none whitespace-pre-wrap">
                    {formatRupiah(item.max_price_category)}
                  </p>
                  <div className="w-48 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center w-full border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <p>Edit</p>
                    </Button>
                    <Button
                      className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <div>Delete</div>
                    </Button>
                  </div>
                </div>
              ))}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};
