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
import { useModal } from "@/hooks/use-modal";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRightCircle,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader,
  ReceiptText,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading";

interface DetailManifest {
  id: string;
  code_document: string;
  old_barcode_product: string;
  old_name_product: string;
  old_quantity_product: number;
  old_price_product: number;
  created_at: string;
  updated_at: string;
}

export const Client = () => {
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/product_scans?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };

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
          url: `/inbound/check-product/scan-result`,
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
    handleGetData();
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
          <BreadcrumbItem>Check Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Scan Result</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product Scan</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full flex-auto">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-3 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                  <p className="w-52 flex-none">Price</p>
                  <p className="w-52 flex-none">User</p>
                  <p className="w-24 flex-none text-center">Action</p>
                </div>
                {data.map((item, i) => (
                  <div
                    className="flex w-full px-5 py-3 text-sm gap-3 border-b border-sky-200 items-center hover:border-sky-300"
                    key={item.id}
                  >
                    <p className="w-10 text-center flex-none">
                      {page.from + i}
                    </p>
                    <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.product_name}
                    </p>
                    <p className="w-52 flex-none overflow-hidden text-ellipsis">
                      {formatRupiah(parseFloat(item.product_price))}
                    </p>
                    <p className="w-52 flex-none overflow-hidden text-ellipsis">
                      {item.user.username}
                    </p>
                    <div className="w-24 flex-none flex gap-4 justify-center">
                      <TooltipProviderPage value="Check">
                        <Link
                          href={`/inbound/check-product/scan-result/${item.id}`}
                          className="w-9"
                        >
                          <Button
                            className="items-center w-full px-0  border-green-400 text-green-700 hover:text-green-700 hover:bg-green-50"
                            variant={"outline"}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipProviderPage>
                      <TooltipProviderPage value="Delete">
                        <Button
                          className="items-center px-0  border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 w-9"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("delete-manifest-inbound", item.id)
                          }
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
