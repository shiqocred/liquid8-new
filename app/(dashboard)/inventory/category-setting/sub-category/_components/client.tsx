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
          <div className="grid grid-cols-2 xl:grid-cols-3 w-full gap-4 p-4 border border-sky-400 rounded-md">
            {settingCategory.map((item, i) => (
              <div
                key={item.id}
                className="rounded-md w-full shadow border col-span-1 px-6 py-3 flex justify-between gap-3 relative h-24 items-center group"
              >
                <div className="w-full h-full bg-white/5 backdrop-blur-sm absolute flex opacity-0 group-hover:opacity-100 left-0 top-0 transition-all items-center justify-center gap-4">
                  <Button className="bg-yellow-400 hover:bg-yellow-400/80 text-black border border-black">
                    <Edit3 className="w-4 h-4 mr-2 " />
                    Edit
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-500/80 text-black border border-black">
                    <Trash2 className="w-4 h-4 mr-2 " />
                    Delete
                  </Button>
                </div>
                <div className="flex flex-col justify-start h-full">
                  <h5>{item.name_category}</h5>
                  <div className="flex items-center gap-2 text-xs text-black/50">
                    <p>Max. Price {formatRupiah(item.max_price_category)}</p>
                  </div>
                </div>
                <div className="flex justify-end text-4xl font-semibold">
                  {item.discount_category}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
