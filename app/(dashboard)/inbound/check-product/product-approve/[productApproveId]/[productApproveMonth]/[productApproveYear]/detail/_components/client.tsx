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
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [orientation, setOrientation] = useState(searchParams.get("s") ?? "");
  const [copied, setCopied] = useState<number | null>(null);
  const [dataResults, setDataResults] = useState<DetailManifest[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

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
          url: `/inbound/check-product/product-approve/${params.productApproveId}/${params.productApproveMonth}/${params.productApproveYear}/detail`,
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

  const [documentData, setDocumentData] = useState({
    base_document: "",
    total_column_in_document: 0,
    status_document: "",
    code_document: "",
  });

  useEffect(() => {
    const savedDocumentData = localStorage.getItem("documentData");
    if (savedDocumentData) {
      setDocumentData(JSON.parse(savedDocumentData));
    }
  }, []);

  const fetchDetailDocuments = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      const codeDocument = `${params.productApproveId}/${params.productApproveMonth}/${params.productApproveYear}`;
      try {
        const response = await axios.get(
          `${baseUrl}/product_olds-search?search=${codeDocument}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataResults(response.data.data.resource.data);
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
      fetchDetailDocuments(page, searchValue);
    }
  }, [searchValue, page, fetchDetailDocuments, params, accessToken]);

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
          <BreadcrumbItem>
            <BreadcrumbLink href="/inbound/check-product/product-approve">
              Product Approve
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-8 rounded-md shadow bg-white w-full px-5">
        <div className="w-full text-xs flex items-center">
          <Link
            href={"/inbound/check-product/product-approve"}
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
              {documentData.base_document}
            </h3>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col items-end w-1/4 border-r border-gray-500 pr-5 mr-5">
            <p className="font-semibold text-gray-800">Status</p>
            <h3 className="text-gray-700 font-light text-xl">
              {documentData.status_document}
            </h3>
          </div>
          <div className="flex flex-col items-end w-2/4 border-r border-gray-700 pr-5 mr-5">
            <p className="font-semibold text-gray-800">Merged Data</p>
            <h3 className="text-gray-700 font-light text-xl">
              {documentData.code_document}
            </h3>
          </div>
          <div className="flex flex-col items-end w-1/4">
            <p className="font-semibold text-gray-800">Total</p>
            <h3 className="text-gray-700 font-light text-xl">
              {documentData.total_column_in_document.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Data Product</h2>
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
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-32 flex-none">Old Barcode</p>
              <p className="w-32 flex-none">New Barcode</p>
              <p className="w-full min-w-72">Product Name</p>
              <p className="w-24 flex-none">status</p>
              <p className="w-24 flex-none text-center">Action</p>
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <p className="w-32 flex-none">8924-001441</p>
                <p className="w-32 flex-none">L35ESX2BWZ</p>
                <p className="w-full min-w-72">
                  [WARNA BARU] HUAWEI Band 9 | Smartband | Comfortable All-Day
                  Wearing | Advanced Sleep Health Management | Up to Two-Week
                  Battery Life | Smartwatch-like Display
                </p>
                <p className="w-24 flex-none">
                  <Badge
                    className={cn(
                      "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400"
                    )}
                  >
                    Done
                  </Badge>
                </p>
                <div className="w-24 flex gap-4 justify-center">
                  <TooltipProviderPage value={<p>Detail</p>}>
                    <Button
                      className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                      variant={"outline"}
                    >
                      <ReceiptText className="w-4 h-4" />
                    </Button>
                  </TooltipProviderPage>
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
          </div>
          <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">
              Page {page} of {page}
            </p>
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
