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
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Loading from "../loading";
import { baseUrl } from "@/lib/baseUrl";

interface SettingColor {
  id: number;
  hexa_code_color: string;
  name_color: string;
  min_price_color: number;
  max_price_color: number;
  fixed_price_color: number;
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
  const [settingColor, setSettingColor] = useState<SettingColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const fetchSettingColor = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/color_tags?page=${page}&q=${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSettingColor(response.data.data.resource);
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
      fetchSettingColor(page, searchValue);
    }
  }, [searchValue, page, fetchSettingColor, accessToken]);

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
          url: "/inventory/category-setting/tag-color",
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
          <BreadcrumbItem>Setting Tag Color</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Tag Colors</h2>
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
                Add Color
              </Button>
              <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                <FileDown className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 w-full gap-4 p-4 border border-sky-400 rounded-md">
            {settingColor.map((item, i) => (
              <div
                key={item.id}
                className="rounded-md w-full shadow col-span-1 px-6 py-3 flex justify-between gap-3 relative h-24 items-center group border"
              >
                <div className="flex flex-col w-full justify-start h-full">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ background: item.hexa_code_color }}
                        className="w-4 h-4 rounded-full border border-gray-500"
                      />
                      <h5 className="font-semibold">{item.name_color}</h5>
                      <p className="text-xs">({item.hexa_code_color})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProviderPage value="Edit">
                        <button className="w-5 h-5 flex items-center justify-center shadow rounded-full bg-yellow-200/80 hover:bg-yellow-200  text-yellow-700">
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </TooltipProviderPage>
                      <TooltipProviderPage value="Delete">
                        <button className="w-5 h-5 flex items-center justify-center shadow rounded-full bg-red-200/80 hover:bg-red-200  text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </TooltipProviderPage>
                    </div>
                  </div>
                  <div className="flex w-full flex-col mt-1 pt-1 border-t border-gray-500 gap-1 text-xs text-black/50">
                    <div className="w-full flex items-center justify-between">
                      <p>Fixed Price:</p>
                      <p>{formatRupiah(item.fixed_price_color)}</p>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <p>Range Price:</p>
                      <p>
                        {formatRupiah(item.min_price_color)} -{" "}
                        {formatRupiah(item.max_price_color)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
