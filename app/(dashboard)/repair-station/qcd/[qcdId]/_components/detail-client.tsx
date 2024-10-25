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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { baseUrl } from "@/lib/baseUrl";
import { formatRupiah } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft, Barcode, FileDown, Loader2, Trash2 } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const DetailClient = () => {
  const params = useParams();
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [data, setData] = useState<any>();
  const [product, setProduct] = useState<any[]>([]);

  const handleGetData = async (p?: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/bundle/qcd/${params.qcdId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource);
      setProduct(response.data.data.resource.product_qcds);
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    setLoadingExport(true);
    try {
      const response = await axios.get(
        `${baseUrl}/export-dumps-excel/${params.qcdId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("File Successfully Exported");
      // download export
      const link = document.createElement("a");
      link.href = response.data.data.resource;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingExport(false);
    }
  };

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
          <BreadcrumbItem>Repair Station</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/repair-station/qcd">QCD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/repair-station/qcd">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail QCD</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          {loading ? (
            <div className="flex flex-col w-full gap-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-52 h-7" />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <h5 className="font-medium">{data?.barcode_bundle}</h5>
              <h3 className="text-xl font-semibold capitalize">
                {data?.name_bundle}
              </h3>
            </div>
          )}
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Total Price</p>
            {loading ? (
              <Skeleton className="w-32 h-4 mt-1" />
            ) : (
              <p className="font-medium text-sm">
                {formatRupiah(data?.total_price_bundle ?? 0) ?? "Rp 0"}
              </p>
            )}
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Custom Display</p>
            {loading ? (
              <Skeleton className="w-32 h-4 mt-1" />
            ) : (
              <p className="font-medium text-sm">
                {formatRupiah(data?.total_price_custom_bundle ?? 0) ?? "Rp 0"}
              </p>
            )}
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() =>
                onOpen("barcode-printered-qcd-detail-modal", {
                  oldPrice: data?.total_price_bundle,
                  barcode: data?.barcode_bundle,
                  category: data?.name_bundle,
                  newPrice: data?.total_price_custom_bundle,
                })
              }
              className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700"
            >
              <Barcode className="w-4 h-4 mr-1" />
              Barcode
            </Button>
            <TooltipProviderPage value="Delete" align="end">
              <Button
                type="button"
                onClick={() => onOpen("delete-qcd-bundle-modal", data?.id)}
                className="w-9 px-0 bg-transparent border border-red-500 text-red-500 hover:bg-red-200 hover:border-red-700 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 " />
              </Button>
            </TooltipProviderPage>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in QCD
          </h2>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleExport}
              disabled={loadingExport}
              className="bg-sky-400/80 hover:bg-sky-400 text-black disabled:opacity-100"
            >
              {loadingExport ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <FileDown className="w-4 h-4 mr-1" />
              )}
              Export Data
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Code Document</p>
                <p className="w-28 flex-none">Barcode</p>
                <p className="w-32 flex-none">Category</p>
                <p className="w-full min-w-72 max-w-[500px] flex-none">
                  Product Name
                </p>
                <p className="w-40 flex-none">Price</p>
                <p className="w-28 flex-none">Status</p>
              </div>
              {loading ? (
                <div className="w-full">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="h-4 w-7" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="h-4 w-18" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="w-full min-w-72 max-w-[500px] flex-none">
                        <Skeleton className="h-4 w-52" />
                      </div>
                      <div className="w-40 flex-none">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {product.map((item, i) => (
                    <div
                      className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">{i + 1}</p>
                      <p className="w-32 flex-none overflow-hidden text-ellipsis">
                        {item.code_document}
                      </p>
                      <TooltipProviderPage
                        value={
                          item.new_barcode_product ?? item.old_barcode_product
                        }
                      >
                        <p className="w-28 flex-none whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.new_barcode_product ?? item.old_barcode_product}
                        </p>
                      </TooltipProviderPage>
                      <TooltipProviderPage
                        value={item.new_category_product ?? "-"}
                      >
                        <p className="w-32 flex-none whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.new_category_product ?? "-"}
                        </p>
                      </TooltipProviderPage>
                      <TooltipProviderPage value={item.new_name_product}>
                        <p className="w-full min-w-72 max-w-[500px] flex-none whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.new_name_product}
                        </p>
                      </TooltipProviderPage>
                      <div className="w-40 flex-none">
                        {formatRupiah(
                          item.new_price_product ?? item.old_price_product
                        ) ?? "Rp 0"}
                      </div>
                      <div className="w-28 flex-none">
                        <Badge className="bg-sky-400/80 hover:bg-sky-400/80 text-black rounded font-normal capitalize">
                          {item.new_status_product.split("_").join(" ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClient;
