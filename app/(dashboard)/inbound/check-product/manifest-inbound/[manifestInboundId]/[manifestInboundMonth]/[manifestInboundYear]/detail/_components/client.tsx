"use client";

import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRightCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Grid2x2X,
  Loader,
  RefreshCw,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { baseUrl } from "@/lib/baseUrl";
import { useModal } from "@/hooks/use-modal";
import { cn, formatRupiah } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

import Loading from "../loading";
import NotFound from "@/app/not-found";
import { Skeleton } from "@/components/ui/skeleton";

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
  // core
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [is404, setIs404] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  // state search & orientasion
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [dataResults, setDataResults] = useState<any[]>([]);
  const [metaData, setMetaData] = useState({
    document_name: "",
    status: "",
    total_columns: "",
    code_document: "",
    custom_barcode: "",
  });
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // handle copy
  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // handle search parrams
  const handleCurrentId = useCallback(
    (q: string, p: number) => {
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        page: p,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!p || p <= 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: `/inbound/check-product/manifest-inbound/${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}/detail`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  // handle GET
  const fetchDetailDocuments = async () => {
    setLoading(true);
    const codeDocument = `${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}`;
    try {
      const response = await axios.get(
        `${baseUrl}/product_olds-search?search=${codeDocument}&page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataResults(response.data.data.resource.data.data);
      setMetaData(response.data.data.resource);
      setPage({
        current: response.data.data.resource.data.current_page ?? 1,
        last: response.data.data.resource.data.last_page ?? 1,
        from: response.data.data.resource.data.from ?? 0,
        total: response.data.data.resource.data.total ?? 0,
        perPage: response.data.data.resource.data.per_page ?? 0,
      });
    } catch (err: any) {
      if (err.response.status === 404) {
        setIs404(true);
      }
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCurrentId(searchValue, page.current);
    fetchDetailDocuments();
  }, [searchValue, page.current]);

  useEffect(() => {
    if (cookies.get("detailManifestInbound")) {
      fetchDetailDocuments();
      return cookies.remove("detailManifestInbound");
    }
  }, [cookies.get("detailManifestInbound")]);

  useEffect(() => {
    setIsMounted(true);
    fetchDetailDocuments();
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  if (is404) {
    return (
      <div className="flex flex-col items-start h-full bg-gray-100 w-full relative p-4 gap-4">
        <div className="w-full h-full overflow-hidden rounded-md shadow-md flex items-center justify-center relative">
          <NotFound isDashboard />
        </div>
      </div>
    );
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
          <BreadcrumbItem>
            <BreadcrumbLink href="/inbound/check-product/manifest-inbound/">
              Manifest Inbound
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-8 rounded-md shadow bg-white w-full px-5">
        <div className="w-full text-xs flex items-center">
          <Link
            href={"/inbound/check-product/manifest-inbound"}
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
            <TooltipProviderPage value={metaData.document_name}>
              <h3 className="text-black font-semibold text-xl line-clamp-1">
                {metaData.document_name}
              </h3>
            </TooltipProviderPage>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col items-end w-1/5 border-r border-gray-500 pr-5 mr-5">
            <p className="text-sm font-medium">Status</p>
            <h3 className="text-gray-700 font-light capitalize">
              {metaData.status}
            </h3>
          </div>
          <div className="flex flex-col items-end w-2/5 border-r border-gray-700 pr-5 mr-5">
            <p className="text-sm font-medium">Merged Data</p>
            <h3 className="text-gray-700 font-light capitalize">
              {metaData.code_document}
            </h3>
          </div>
          <div className="flex flex-col items-end w-1/5 border-r border-gray-700 pr-5 mr-5">
            <p className="text-sm font-medium">Total</p>
            <h3 className="text-gray-700 font-light capitalize">
              {metaData.total_columns.toLocaleString()}
            </h3>
          </div>
          <div className="flex flex-col items-end w-1/5">
            <button
              onClick={() =>
                onOpen("custom-barcode", {
                  code_document: metaData.code_document,
                  custom_barcode: metaData.custom_barcode,
                })
              }
              className="text-sm font-medium flex items-center hover:bg-sky-100 rounded-md px-3 underline text-sky-700"
            >
              Barcode
              <ArrowLeftRight className="w-3 h-3 ml-1" />
            </button>
            <h3 className="text-gray-700 font-light capitalize pr-3">
              {metaData.custom_barcode ?? "-"}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">Detail Data Process</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 items-center w-full flex-auto">
              <Input
                className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400 flex-none"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("detailManifestInbound", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                  variant={"outline"}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
              <div className="flex items-center justify-end w-full">
                <Link
                  href={`/inbound/check-product/manifest-inbound/${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}/check`}
                >
                  <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                    <ArrowRightCircle className="w-4 h-4 mr-1" />
                    Next
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-52 flex-none">Resi Number</p>
                <p className="w-full min-w-72 max-w-[700px]">Product Name</p>
                <p className="w-24 text-center flex-none">QTY</p>
                <p className="w-28 flex-none">Price</p>
                <p className="w-20 flex-none text-center">Action</p>
              </div>
              {loading ? (
                <div className="w-full h-full">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-full px-5 py-7 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    >
                      <div className="w-10 text-center flex-none">
                        <Skeleton className="w-8 h-4" />
                      </div>
                      <div className="w-52 flex-none flex items-center">
                        <Skeleton className="w-40 h-4" />
                      </div>
                      <div className="w-full min-w-72 max-w-[700px]">
                        <Skeleton className="w-64 h-4" />
                      </div>
                      <div className="w-24 flex justify-center flex-none">
                        <Skeleton className="w-14 h-4" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="w-20 flex-none flex justify-center">
                        <Skeleton className="w-10 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full">
                  {dataResults.length > 0 ? (
                    dataResults.map((item, index) => (
                      <div
                        className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {index + 1}
                        </p>
                        <div className="w-52 flex-none flex items-center">
                          <p>{item.old_barcode_product}</p>
                          <TooltipProviderPage
                            value={
                              <p>
                                {copied === index ? "Copied" : "Copy Barcode"}
                              </p>
                            }
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleCopy(item.old_barcode_product, index);
                              }}
                              disabled={copied === index}
                            >
                              {copied === index ? (
                                <Check className="w-3 h-3 ml-2" />
                              ) : (
                                <Copy className="w-3 h-3 ml-2" />
                              )}
                            </button>
                          </TooltipProviderPage>
                        </div>
                        <p className="w-full min-w-72 max-w-[700px] text-ellipsis whitespace-nowrap overflow-hidden">
                          {item.old_name_product}
                        </p>
                        <p className="w-24 text-center flex-none">
                          {item.old_quantity_product}
                        </p>
                        <p className="w-28 flex-none">
                          {formatRupiah(item.old_price_product)}
                        </p>
                        <div className="w-20 flex-none flex justify-center">
                          <Button
                            className="items-center w-9 px-0 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            onClick={() =>
                              onOpen("delete-detail-manifest-inbound", item.id)
                            }
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Grid2x2X className="w-8 h-8" />
                        <p className="text-sm font-semibold">No Data Viewed.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                Total: {page.total}
              </Badge>
              <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                Row per page: {page.perPage}
              </Badge>
            </div>
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
                    setPage((prev) => ({ ...prev, current: prev.current + 1 }))
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
