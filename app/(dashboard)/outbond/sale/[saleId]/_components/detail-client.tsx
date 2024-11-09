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
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ArrowLeft,
  Box,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Edit2,
  Edit3,
  FileDown,
  Grid2x2X,
  Loader2,
  Minus,
  PercentCircle,
  Plus,
  PlusCircle,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const DetailClient = () => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();
  // state bool
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingCarton, setLoadingCarton] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartonOpen, setIsCartonOpen] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    unitPrice: "0",
    qty: "0",
  });

  const [dataSearchProduct, setDataSearchProduct] = useState("");
  const searchValueProduct = useDebounce(dataSearchProduct);
  const [pageProduct, setPageProduct] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // state data
  const [productsSale, setProductsSale] = useState<any[]>([]);
  const [data, setData] = useState<any>();
  const [dataProduct, setDataProduct] = useState<any[]>([]);

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/sale-documents/${params.saleId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource);
      setInput({
        qty: Math.round(response.data.data.resource.cardbox_qty).toString(),
        unitPrice: Math.round(
          response.data.data.resource.cardbox_unit_price
        ).toString(),
      });
      setProductsSale(response.data.data.resource.sales);
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetProduct = async (p?: number) => {
    setLoadingProduct(true);
    try {
      const response = await axios.get(
        `${baseUrl}/sale-products?page=${
          p ?? pageProduct.current
        }&q=${searchValueProduct}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataProduct(response.data.data.resource.data);
      setPageProduct({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingProduct(false);
    }
  };
  const handleUpdateCarton = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingCarton(true);
    const body = {
      cardbox_qty: input.qty,
      cardbox_unit_price: input.unitPrice,
    };
    try {
      const response = await axios.put(
        `${baseUrl}/sale-documents/${params.saleId}`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Carton Box value successfully updated");
      cookies.set("detailSale", "updated");
      setIsCartonOpen(false);
    } catch (err: any) {
      toast.error(
        `Error ${err.response.status}: Carton Box value failed to update`
      );
      console.log("ERROR_UPDATE_CARTON_BOX:", err);
    } finally {
      setLoadingCarton(false);
    }
  };
  const handleAddProduct = async (e: MouseEvent, b: string) => {
    e.preventDefault();
    setLoadingAdd(true);
    const body = {
      sale_barcode: b,
      sale_document_id: params.saleId,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/sale-document/add-product`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      cookies.set("detailSale", "added");
      setIsProductOpen(false);
      setDataSearchProduct("");
      toast.success("Pruduct successfully added");
    } catch (err: any) {
      toast.error(
        err.response.data.data.message === "Data sudah dimasukkan!"
          ? "Product has been added"
          : `Error ${err.response.status}: Product failed to add`
      );
      console.log("ERROR_ADD_PRODUCT:", err);
    } finally {
      setLoadingAdd(false);
    }
  };
  const handleExportProduct = async (e: MouseEvent, t: "product" | "data") => {
    e.preventDefault();
    setLoadingExport(true);
    try {
      const response = await axios.get(
        `${baseUrl}/sale-report?code_document_sale=${data?.code_document_sale}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (t === "product") {
        onOpen("print-product-sale-modal", response.data);
      } else {
        onOpen("print-data-sale-modal", response.data);
      }
      toast.success("Data successfully found");
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ??
          `Error ${err.response.status}: Product failed to add`
      );
      console.log("ERROR_EXPORT_PRODUCT:", err);
    } finally {
      setLoadingExport(false);
    }
  };

  useEffect(() => {
    handleGetProduct(1);
  }, [searchValueProduct]);
  useEffect(() => {
    if (cookies.get("productUpdate")) {
      handleGetProduct();
      return cookies.remove("productUpdate");
    }
  }, [cookies.get("productUpdate"), pageProduct.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("detailSale")) {
      handleGetData();
      return cookies.remove("detailSale");
    }
  }, [cookies.get("detailSale")]);
  useEffect(() => {
    if (cookies.get("detailSaleProduct")) {
      handleGetProduct();
      return cookies.remove("detailSaleProduct");
    }
  }, [cookies.get("detailSaleProduct")]);

  useEffect(() => {
    if (isNaN(parseFloat(input.qty))) {
      setInput((prev) => ({ ...prev, qty: "0" }));
    }
    if (isNaN(parseFloat(input.unitPrice))) {
      setInput((prev) => ({ ...prev, unitPrice: "0" }));
    }
  }, [input]);

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
    handleGetProduct();
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
          <BreadcrumbItem>Outbond</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/outbond/sale">Sale</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/sale">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail Sale</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4">
              <h5 className="font-medium text-sm">
                {data?.code_document_sale}
              </h5>
              <Badge className="bg-sky-300 hover:bg-sky-300 text-xs font-normal text-black rounded-full py-0.5 capitalize">
                {data?.total_product_document_sale}{" "}
                {data?.total_product_document_sale > 1 ? "Products" : "Product"}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold capitalize">
              {data?.buyer_name_document_sale}
            </h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-96 pl-5">
            <p className="text-sm">Voucher</p>
            <p className="font-medium text-lg">
              {formatRupiah(data?.voucher) ?? "Rp 0"}
            </p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-96 pl-5">
            <p className="text-sm">Total Price</p>
            <p className="font-medium text-lg">
              {formatRupiah(data?.total_price_document_sale)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 items-center gap-3">
        <div className="flex flex-col items-center justify-center flex-none gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
            <Box className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold whitespace-nowrap">CARTON BOX</p>
        </div>
        <Dialog open={isCartonOpen} onOpenChange={setIsCartonOpen}>
          <DialogTrigger asChild>
            <Button className="bg-transparent shadow-none text-black justify-between w-full hover:bg-transparent group gap-3 h-full focus-visible:ring-0">
              <div className="flex flex-col items-start pl-3 border-l border-gray-500 w-full text-sm">
                <p className="group-hover:underline">Unit Price Carton Box</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(parseFloat(input.unitPrice)) ?? "Rp 0"}
                </p>
              </div>
              <div className="flex flex-col items-start pl-3 border-l border-gray-500 w-full text-sm">
                <p className="group-hover:underline">Qty Carton Box</p>
                <p className="text-lg font-semibold">
                  {parseFloat(input.qty).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-start pl-3 border-l border-gray-500 w-full text-sm">
                <p className="group-hover:underline">Total Price Carton Box</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(
                    parseFloat(input.unitPrice) * parseFloat(input.qty)
                  ) ?? "Rp 0"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-black rounded text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 duration-300">
                  Edit
                </p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 group-hover:bg-yellow-300 duration-300 flex-none">
                  <Edit3 className="w-5 h-5" />
                </div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Carton Description</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleUpdateCarton}
              className="pt-5 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1 w-full">
                <Label>Unit Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0"
                  value={input.unitPrice}
                  // disabled={loadingSubmit}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      unitPrice: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Qty</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0"
                  value={input.qty}
                  // disabled={loadingSubmit}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      qty: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
                <div className="flex items-center gap-2 absolute right-3 bottom-2">
                  <Button
                    type="button"
                    className="w-9 p-0 bg-transparent hover:bg-sky-100 border border-gray-300 hover:border-gray-500 text-black"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        qty: (parseFloat(prev.qty) - 1).toString(),
                      }))
                    }
                    disabled={parseFloat(input.qty) <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    className="w-9 p-0 bg-transparent hover:bg-sky-100 border border-gray-300 hover:border-gray-500 text-black"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        qty: (parseFloat(prev.qty) + 1).toString(),
                      }))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Label>Total Price</Label>
                <div className="text-sm font-bold border border-sky-500 rounded-md flex px-5 items-center justify-center h-9">
                  {formatRupiah(
                    parseFloat(input.qty) * parseFloat(input.unitPrice)
                  ) ?? "Rp 0"}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Button
                  type="button"
                  className="w-full bg-transparent hover:bg-gray-100 text-black  border border-black/80 hover:border-black  disabled:opacity-100"
                  onClick={() => setIsCartonOpen(false)}
                  disabled={loadingCarton}
                >
                  {loadingCarton ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-sky-400/80 hover:bg-sky-500 text-black disabled:opacity-100"
                  disabled={
                    (input.qty === Math.round(data?.cardbox_qty).toString() &&
                      input.unitPrice ===
                        Math.round(data?.cardbox_unit_price).toString()) ||
                    loadingCarton
                  }
                >
                  {loadingCarton ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full bg-sky-300 rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-96 pl-5">
              <p className="text-sm font-medium">Grand Total</p>
              <p className="font-bold text-xl">
                {formatRupiah(data?.grand_total) ?? "Rp 0"}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="bg-gray-700 h-12" />
          <Button
            onClick={(e) => handleExportProduct(e, "product")}
            className="ml-3 bg-transparent border border-black text-black hover:bg-sky-400 hover:border-black hover:text-black disabled:opacity-100"
            disabled={loadingExport || loading}
          >
            {loadingExport || loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Printer className="w-4 h-4 mr-2" />
            )}
            Export By Product
          </Button>
          <Button
            onClick={(e) => handleExportProduct(e, "data")}
            className="ml-3 bg-transparent border border-black text-black hover:bg-sky-400 hover:border-black hover:text-black disabled:opacity-100"
            disabled={loadingExport || loading}
          >
            {loadingExport || loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            Export Data
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in Sale
          </h2>
          <div className="flex items-center gap-4">
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("detailSale", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                variant={"outline"}
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4",
                    loadingProduct ? "animate-spin" : ""
                  )}
                />
              </Button>
            </TooltipProviderPage>
            <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Products
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[75vw] w-full flex flex-col">
                <DialogHeader>
                  <DialogTitle className="justify-between flex items-center">
                    List Products
                    <TooltipProviderPage value="close" side="left">
                      <button
                        onClick={() => setIsProductOpen(false)}
                        className="w-6 h-6 flex items-center justify-center border border-black hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </TooltipProviderPage>
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-5 mt-5 text-sm">
                  <div className="flex gap-4 items-center w-full">
                    <div className="relative flex w-1/3 items-center">
                      <Input
                        className="border-sky-400/80 focus-visible:ring-sky-400 w-full pl-10"
                        placeholder="Search product..."
                        id="searchProduct"
                        value={dataSearchProduct}
                        onChange={(e) => setDataSearchProduct(e.target.value)}
                        autoFocus
                      />
                      <Label
                        htmlFor="searchProduct"
                        className="absolute left-3 cursor-text"
                      >
                        <Search className="w-5 h-5" />
                      </Label>
                    </div>
                    <TooltipProviderPage value={"Reload Data"}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          cookies.set("updateProduct", "update");
                        }}
                        className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <RefreshCw
                          className={cn(
                            "w-4 h-4",
                            loadingProduct ? "animate-spin" : ""
                          )}
                        />
                      </Button>
                    </TooltipProviderPage>
                  </div>
                  <div className="w-full p-4 rounded-md border border-sky-400/80 h-full">
                    <ScrollArea className="w-full ">
                      <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                        <p className="w-10 text-center flex-none">No</p>
                        <p className="w-32 flex-none">Barcode</p>
                        <p className="w-full min-w-44 max-w-[500px]">
                          Product Name
                        </p>
                        <p className="w-52 flex-none">Category</p>
                        <p className="w-24 text-center flex-none ml-auto">
                          Action
                        </p>
                      </div>
                      {loadingProduct ? (
                        <div className="w-full h-[50vh]">
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                              key={i}
                            >
                              <div className="w-10 flex justify-center flex-none">
                                <Skeleton className="w-7 h-4" />
                              </div>
                              <div className="w-32 flex-none">
                                <Skeleton className="w-24 h-4" />
                              </div>
                              <div className="w-full min-w-44 max-w-[500px]">
                                <Skeleton className="w-44 h-4" />
                              </div>
                              <div className="w-52 flex-none">
                                <Skeleton className="w-44 h-4" />
                              </div>
                              <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                                <Skeleton className="w-20 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ScrollArea className="h-[50vh]">
                          {dataProduct.length > 0 ? (
                            dataProduct.map((item, i) => (
                              <div
                                className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                                key={item.id}
                              >
                                <p className="w-10 text-center flex-none">
                                  {pageProduct.from + i}
                                </p>
                                <p className="w-32 flex-none">{item.barcode}</p>
                                <TooltipProviderPage
                                  value={
                                    <p className="w-auto max-w-44 ">
                                      {item.name}
                                    </p>
                                  }
                                >
                                  <p className="w-full min-w-44 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                                    {item.name}
                                  </p>
                                </TooltipProviderPage>
                                <p className="w-52 flex-none">
                                  {item.category}
                                </p>
                                <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                                  <Button
                                    className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-100 disabled:bg-sky-200"
                                    variant={"outline"}
                                    type="button"
                                    onClick={(e) => {
                                      handleAddProduct(e, item.barcode);
                                    }}
                                    disabled={loadingAdd}
                                  >
                                    {loadingAdd ? (
                                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                      <Plus className="w-4 h-4 mr-1" />
                                    )}
                                    <div>Add</div>
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-[45vh] flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Grid2x2X className="w-8 h-8" />
                                <p className="text-sm font-semibold">
                                  No Data Viewed.
                                </p>
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                      )}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                        Total: {pageProduct.total}
                      </Badge>
                      <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                        Row per page: {pageProduct.perPage}
                      </Badge>
                    </div>
                    <div className="flex gap-5 items-center">
                      <div className="text-sm">
                        <Popover modal={true}>
                          <PopoverTrigger>
                            Page {pageProduct.current}
                          </PopoverTrigger>
                          <PopoverContent className="w-24 p-1">
                            <Command>
                              <CommandInput />
                              <CommandList>
                                <CommandEmpty>Data not found.</CommandEmpty>
                                <CommandGroup>
                                  {Array.from(
                                    { length: pageProduct.last },
                                    (_, i) => (
                                      <CommandItem
                                        key={i}
                                        className="text-center"
                                        onSelect={() => {
                                          setPageProduct((prev) => ({
                                            ...prev,
                                            current: i + 1,
                                          }));
                                          cookies.set("productUpdate", "add");
                                        }}
                                      >
                                        {i + 1}
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>{" "}
                        of {pageProduct.last}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                          onClick={() => {
                            setPageProduct((prev) => ({
                              ...prev,
                              current: prev.current - 1,
                            }));
                            cookies.set("productUpdate", "add");
                          }}
                          disabled={pageProduct.current === 1}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                          onClick={() => {
                            setPageProduct((prev) => ({
                              ...prev,
                              current: prev.current + 1,
                            }));
                            cookies.set("productUpdate", "add");
                          }}
                          disabled={pageProduct.current === pageProduct.last}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full p-4 rounded-md border border-sky-400/80">
          <ScrollArea>
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-36 flex-none">Barcode</p>
              <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
              <p className="w-44 flex-none">Price</p>
              <p className="w-96 text-center flex-none ml-auto">Action</p>
            </div>
            {loading ? (
              <div className="w-full">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    key={i}
                  >
                    <div className="w-10 flex justify-center flex-none">
                      <Skeleton className="w-7 h-4" />
                    </div>
                    <div className="w-36 flex-none">
                      <Skeleton className="w-28 h-4" />
                    </div>
                    <div className="w-full min-w-72 max-w-[500px]">
                      <Skeleton className="w-72 h-4" />
                    </div>
                    <div className="w-44 flex-none">
                      <Skeleton className="w-32 h-4" />
                    </div>
                    <div className="w-96 flex-none flex gap-4 justify-center ml-auto">
                      <Skeleton className="w-36 h-4" />
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full min-h-[300px]">
                {productsSale.length > 0 ? (
                  productsSale.map((item, i) => (
                    <div
                      className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">{i + 1}</p>
                      <p className="w-36 flex-none overflow-hidden text-ellipsis">
                        {item.product_barcode_sale}
                      </p>
                      <TooltipProviderPage
                        value={
                          <p className="w-auto max-w-72 ">
                            {item.product_name_sale}
                          </p>
                        }
                      >
                        <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.product_name_sale}
                        </p>
                      </TooltipProviderPage>
                      <p className="w-44 flex-none overflow-hidden text-ellipsis">
                        {formatRupiah(item.product_price_sale) ?? "Rp 0"}
                      </p>
                      <div className="w-96 flex-none flex gap-4 justify-center ml-auto">
                        <Button
                          className="items-center border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("price-product-sale-modal", {
                              id: item.id,
                              price: item.product_price_sale,
                            })
                          }
                        >
                          <CircleDollarSign className="w-4 h-4 mr-1" />
                          <div>Update Price</div>
                        </Button>
                        <Button
                          className="items-center border-violet-400 text-violet-700 hover:text-violet-700 hover:bg-violet-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("gabor-product-sale-modal", {
                              id: item.id,
                              price: item.product_price_sale,
                            })
                          }
                        >
                          <PercentCircle className="w-4 h-4 mr-1" />
                          <div>Gabor</div>
                        </Button>
                        <Button
                          className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("delete-product-sale-modal", {
                              id: item.id,
                              documentId: params.saleId,
                              type: "sale",
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <div>Delete</div>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default DetailClient;
