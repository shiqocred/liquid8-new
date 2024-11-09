"use client";
import React, {
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  BadgeDollarSign,
  BadgePercent,
  Barcode,
  Box,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronDownCircle,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Edit2,
  Edit3,
  Grid2x2X,
  Loader2,
  MapPinned,
  Minus,
  MoreHorizontal,
  PercentCircle,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRupiah } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const CreateClient = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCartonOpen, setIsCartonOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const [loadingBuyer, setLoadingBuyer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const addRef = useRef<HTMLInputElement | null>(null);
  const { onOpen } = useModal();
  const router = useRouter();

  const [input, setInput] = useState({
    unitPrice: "0",
    qty: "0",
    buyer: "",
    barcode: "",
    voucher: "0",
    totalPrice: 0,
  });
  const [dataSearchBuyer, setDataSearchBuyer] = useState("");
  const searchValueBuyer = useDebounce(dataSearchBuyer);
  const [dataSearchProduct, setDataSearchProduct] = useState("");
  const searchValueProduct = useDebounce(dataSearchProduct);
  const [dataSearchAddProduct, setDataSearchAddProduct] = useState("");
  const searchValueAddProduct = useDebounce(dataSearchAddProduct);
  const [pageBuyer, setPageBuyer] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  const [pageFilter, setPageFilter] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  const [pageProduct, setPageProduct] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [dataBuyer, setDataBuyer] = useState<any[]>([]);
  const [dataFilter, setDataFilter] = useState<any[]>([]);
  const [dataProduct, setDataProduct] = useState<any[]>([]);
  const [data, setData] = useState<any>();

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/sales?page=${pageFilter.current}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setInput((prev) => ({
        ...prev,
        barcode: dataRes?.code_document_sale,
        buyer: dataRes?.sale_buyer_id,
        totalPrice: dataRes?.total_sale,
      }));
      setData(dataRes);
      setDataFilter(dataRes?.data);
      setPageFilter({
        current: dataRes?.current_page ?? 1,
        last: dataRes?.last_page ?? 1,
        from: dataRes?.from ?? 0,
        total: dataRes?.total ?? 0,
        perPage: dataRes?.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetBuyer = async (p?: number) => {
    setLoadingBuyer(true);
    try {
      const response = await axios.get(
        `${baseUrl}/buyers?page=${
          p ?? pageBuyer.current
        }&q=${searchValueBuyer}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataBuyer(response.data.data.resource.data);
      setPageBuyer({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingBuyer(false);
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
  const handleAddProduct = async (b: string) => {
    const body = {
      buyer_id: input.buyer,
      sale_barcode: b,
      voucher: input.voucher,
    };
    try {
      const response = await axios.post(`${baseUrl}/sales`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      cookies.set("updateDataProduct", "added");
      setIsProductOpen(false);
      toast.success("Pruduct successfully added");
      setDataSearchAddProduct("");
      if (addRef.current) {
        addRef.current.focus();
      }
    } catch (err: any) {
      toast.error(
        err.response.data.data.message === "Data sudah dimasukkan!"
          ? "Product has been added"
          : `Error ${err.response.status}: Product failed to add`
      );
      console.log("ERROR_ADD_PRODUCT:", err);
    }
  };
  const handleFinish = async (e: MouseEvent) => {
    e.preventDefault();
    setLoadingFinish(true);
    const body = {
      cardbox_qty: input.qty,
      cardbox_unit_price: input.unitPrice,
      total_price_document_sale: input.totalPrice,
      voucher: input.voucher,
    };
    try {
      const response = await axios.post(`${baseUrl}/sale-finish`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Sale successfully created");
      router.push("/outbond/sale");
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ??
          `Error ${err.response.status}: Sale failed to create`
      );
      console.log("ERROR_SALE_FINISH:", err);
    } finally {
      setLoadingFinish(false);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.unitPrice))) {
      setInput((prev) => ({ ...prev, unitPrice: "0" }));
    }
    if (isNaN(parseFloat(input.qty))) {
      setInput((prev) => ({ ...prev, qty: "0" }));
    }
  }, [input]);

  useEffect(() => {
    handleGetBuyer(1);
  }, [searchValueBuyer]);
  useEffect(() => {
    if (cookies.get("buyerUpdate")) {
      handleGetBuyer();
      return cookies.remove("buyerUpdate");
    }
  }, [cookies.get("buyerUpdate"), pageBuyer.current]);
  useEffect(() => {
    handleGetProduct(1);
  }, [searchValueProduct]);
  useEffect(() => {
    if (cookies.get("productUpdate")) {
      handleGetProduct();
      return cookies.remove("productUpdate");
    }
  }, [cookies.get("productUpdate"), pageProduct.current]);
  useEffect(() => {
    if (searchValueAddProduct) {
      handleAddProduct(searchValueAddProduct);
    }
  }, [searchValueAddProduct]);

  useEffect(() => {
    if (cookies.get("updateBuyer")) {
      handleGetBuyer();
      return cookies.remove("updateBuyer");
    }
  }, [cookies.get("updateBuyer")]);
  useEffect(() => {
    if (cookies.get("updateDataProduct")) {
      handleGetData();
      return cookies.remove("updateDataProduct");
    }
  }, [cookies.get("updateDataProduct")]);
  useEffect(() => {
    if (cookies.get("updateProduct")) {
      handleGetProduct();
      return cookies.remove("updateProduct");
    }
  }, [cookies.get("updateProduct")]);
  useEffect(() => {
    if (!isBuyerOpen) {
      handleGetBuyer(1);
    }
    if (!isProductOpen) {
      handleGetProduct(1);
    }
  }, [isBuyerOpen, isProductOpen]);

  useEffect(() => {
    setIsMounted(true);
    handleGetBuyer();
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
          <BreadcrumbItem>Cashier</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/sale">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Cashier</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 items-center relative">
        {data?.code_document_sale && (
          <div className="flex gap-4 items-center px-5 py-3  w-1/2 flex-none border-r border-gray-500">
            <TooltipProviderPage value={<p>Barcode Sale</p>}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                <Barcode className="w-5 h-5" />
              </div>
            </TooltipProviderPage>
            <TooltipProviderPage value={<p>Barcode Sale</p>}>
              <h3 className="text-xl font-semibold capitalize">
                {data?.code_document_sale}
              </h3>
            </TooltipProviderPage>
          </div>
        )}
        <Dialog open={isBuyerOpen} onOpenChange={setIsBuyerOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex gap-4 items-center  w-1/2 flex-none bg-transparent hover:bg-transparent text-black shadow-none h-full group overflow-hidden focus-visible:ring-0 disabled:opacity-100 disabled:pointer-events-auto"
              disabled={data?.sale_buyer_id}
            >
              <div className="w-full flex items-center justify-start gap-4 overflow-hidden">
                <TooltipProviderPage value={<p>Buyer Name</p>}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 flex-none">
                    <BriefcaseBusiness className="w-5 h-5" />
                  </div>
                </TooltipProviderPage>
                <TooltipProviderPage
                  value={
                    <p>
                      {dataBuyer.find((item) => item.id === input.buyer)
                        ?.name_buyer ?? "Select buyer first"}
                    </p>
                  }
                >
                  <h3
                    className={cn(
                      "text-xl font-semibold capitalize text-start text-ellipsis whitespace-nowrap overflow-hidden",
                      !dataBuyer.find((item) => item.id === input.buyer)
                        ?.name_buyer && "italic"
                    )}
                  >
                    {dataBuyer.find((item) => item.id === input.buyer)
                      ?.name_buyer ?? "Buyer not selected."}
                  </h3>
                </TooltipProviderPage>
              </div>
              <div
                className={cn(
                  " items-center gap-2 relative",
                  data?.sale_buyer_id ? "hidden" : "flex"
                )}
              >
                <div className="p-2 absolute right-10 bg-white opacity-0 group-hover:opacity-100 duration-300 flex items-center before:content-[''] before:w-5 before:h-full before:bg-gradient-to-r before:from-white/0 before:to-white before:absolute before:-left-5">
                  <p className="bg-black rounded text-white text-xs px-2 py-1 ">
                    Change Buyer
                  </p>
                </div>
                <Button className="w-10 h-10 flex-none p-0 bg-transparent border border-yellow-500 text-black group-hover:bg-yellow-200 hover:border-yellow-700 hover:text-black">
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[75vw] w-full flex flex-col">
            <DialogHeader>
              <DialogTitle className="justify-between flex items-center">
                List Buyers
                <TooltipProviderPage value="close" side="left">
                  <button
                    onClick={() => setIsBuyerOpen(false)}
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
                    value={dataSearchBuyer}
                    onChange={(e) => setDataSearchBuyer(e.target.value)}
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
                      cookies.set("updateBuyer", "update");
                    }}
                    className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                    variant={"outline"}
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4",
                        loadingBuyer ? "animate-spin" : ""
                      )}
                    />
                  </Button>
                </TooltipProviderPage>
              </div>
              <div className="w-full p-4 rounded-md border border-sky-400/80 h-full">
                <ScrollArea className="w-full ">
                  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                    <p className="w-10 text-center flex-none">No</p>
                    <p className="w-full min-w-32 max-w-[300px]">Buyer Name</p>
                    <p className="w-44 flex-none">Phone Number</p>
                    <p className="min-w-44 max-w-[500px] w-full flex-none">
                      Buyer Address
                    </p>
                    <p className="w-24 text-center flex-none ml-auto">Action</p>
                  </div>
                  {loadingBuyer ? (
                    <div className="w-full h-[50vh]">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                          key={i}
                        >
                          <div className="w-10 flex justify-center flex-none">
                            <Skeleton className="w-7 h-4" />
                          </div>
                          <div className="w-full min-w-32 max-w-[300px]">
                            <Skeleton className="w-32 h-4" />
                          </div>
                          <div className="w-44 flex-none">
                            <Skeleton className="w-36 h-4" />
                          </div>
                          <div className="min-w-44 max-w-[500px] w-full flex-none">
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
                      {
                        // filtered.length > 0 ? (
                        dataBuyer.length > 0 ? (
                          dataBuyer.map((item, i) => (
                            <div
                              className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                              key={item.id}
                            >
                              <p className="w-10 text-center flex-none">
                                {pageBuyer.from + i}
                              </p>
                              <TooltipProviderPage
                                value={
                                  <p className="w-auto max-w-32 ">
                                    {item.name_buyer}
                                  </p>
                                }
                              >
                                <p className="w-full min-w-32 max-w-[300px] whitespace-nowrap text-ellipsis overflow-hidden">
                                  {item.name_buyer}
                                </p>
                              </TooltipProviderPage>
                              <p className="w-44 flex-none tabular-nums">
                                {item.phone_buyer}
                              </p>
                              <TooltipProviderPage
                                value={
                                  <p className="w-auto max-w-[500px] ">
                                    {item.address_buyer}
                                  </p>
                                }
                              >
                                <p className="min-w-44 max-w-[500px] w-full whitespace-nowrap text-ellipsis overflow-hidden flex-none">
                                  {item.address_buyer}
                                </p>
                              </TooltipProviderPage>
                              <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                                <Button
                                  className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-100 disabled:bg-sky-200"
                                  variant={"outline"}
                                  type="button"
                                  onClick={() => {
                                    setInput((prev) => ({
                                      ...prev,
                                      buyer: item.id,
                                    }));
                                    setIsBuyerOpen(false);
                                  }}
                                  disabled={item.id === input.buyer}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  <div>
                                    {item.id === input.buyer
                                      ? "Selected"
                                      : "Select"}
                                  </div>
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
                        )
                      }
                    </ScrollArea>
                  )}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                    Total: {pageBuyer.total}
                  </Badge>
                  <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
                    Row per page: {pageBuyer.perPage}
                  </Badge>
                </div>
                <div className="flex gap-5 items-center">
                  <p className="text-sm">
                    Page {pageBuyer.current} of {pageBuyer.last}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                      onClick={() => {
                        setPageBuyer((prev) => ({
                          ...prev,
                          current: prev.current - 1,
                        }));
                        cookies.set("buyerUpdate", "add");
                      }}
                      disabled={pageBuyer.current === 1}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                      onClick={() => {
                        setPageBuyer((prev) => ({
                          ...prev,
                          current: prev.current + 1,
                        }));
                        cookies.set("buyerUpdate", "add");
                      }}
                      disabled={pageBuyer.current === pageBuyer.last}
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
      <div className="flex px-5 py-2 rounded items-center bg-yellow-300 w-full shadow">
        <AlertCircle className="w-4 h-4 mr-2" />
        <p className="text-sm font-medium">
          WARNING: the contents of the{" "}
          <span className="font-bold">carton box</span> will be reset when the
          page is refreshed, please make sure the contents of the{" "}
          <span className="font-bold">carton box</span> are correct before
          submiting the sale.
        </p>
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
              onSubmit={(e) => {
                e.preventDefault();
                setIsCartonOpen(false);
              }}
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
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-500 text-black mt-4"
              >
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 items-center">
        <Dialog open={isVoucherOpen} onOpenChange={setIsVoucherOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-4 items-center  w-1/2 flex-none bg-transparent hover:bg-transparent text-black shadow-none h-full group overflow-hidden rounded-none focus-visible:ring-0">
              <div className="w-full flex items-center justify-start gap-4 overflow-hidden">
                <TooltipProviderPage value={<p>Voucher Amount</p>}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                </TooltipProviderPage>
                <TooltipProviderPage value={<p>Voucher Amount</p>}>
                  <div className="flex gap-4 items-center">
                    <h3 className="text-xl font-semibold capitalize">
                      {formatRupiah(parseFloat(input.voucher)) ?? "Rp 0"}
                    </h3>
                    <Badge className="bg-black hover:bg-black text-white text-xs rounded-full">
                      Voucher
                    </Badge>
                  </div>
                </TooltipProviderPage>
              </div>
              <div className="flex items-center gap-2 relative">
                <div className="p-2 absolute right-10 bg-white opacity-0 group-hover:opacity-100 duration-300 flex items-center before:content-[''] before:w-5 before:h-full before:bg-gradient-to-r before:from-white/0 before:to-white before:absolute before:-left-5">
                  <p className="bg-black rounded text-white text-xs px-2 py-1 ">
                    Change Voucher
                  </p>
                </div>
                <Button className="w-10 h-10 flex-none p-0 bg-transparent border border-yellow-500 text-black group-hover:bg-yellow-200 hover:border-yellow-700 hover:text-black">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Voucher</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsVoucherOpen(false);
              }}
              className="pt-5 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1 w-full">
                <Label>Amount Voucher</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0"
                  value={input.voucher}
                  // disabled={loadingSubmit}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      voucher: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Label>Total Price After Voucher</Label>
                <div className="text-sm font-bold border border-sky-500 rounded-md flex px-5 items-center justify-center h-9">
                  {formatRupiah(input.totalPrice - parseFloat(input.voucher)) ??
                    "Rp 0"}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-500 text-black mt-4"
              >
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <div className="flex gap-4 items-center w-1/2 flex-none px-5 py-3 border-l border-gray-500">
          <TooltipProviderPage value={<p>Total Price</p>}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
          </TooltipProviderPage>
          <TooltipProviderPage
            value={
              <p>Total Product Price - voucher + total carton box price</p>
            }
            align="start"
          >
            <h3 className="text-xl font-semibold capitalize">
              {formatRupiah(
                input.totalPrice -
                  parseFloat(input.voucher) +
                  parseFloat(input.unitPrice) * parseFloat(input.qty)
              ) ?? "Rp 0"}
            </h3>
          </TooltipProviderPage>
        </div>
      </div>
      {input.buyer && dataFilter.length > 0 ? (
        <div className="flex w-full bg-sky-300 rounded-md overflow-hidden shadow p-5 items-center justify-between gap-4">
          <div className="w-full flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            <p className="w-full text-sm font-medium">
              ATTENTION: Make sure all sales data is correct!
            </p>
          </div>
          <Button
            onClick={handleFinish}
            disabled={loadingFinish}
            className="rounded h-10 flex-none bg-transparent border border-black text-black hover:bg-sky-500 hover:border-black hover:text-black disabled:opacity-100"
          >
            {loadingFinish ? (
              <Loader2 className="w-4 h-4 animate-spin mr-3" />
            ) : (
              <Send className="w-4 h-4 mr-3" />
            )}
            Send
          </Button>
        </div>
      ) : (
        <div className="flex w-full bg-red-300 rounded-md overflow-hidden shadow p-5 items-center justify-between gap-4">
          <div className="w-full flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            <p className="w-full text-sm font-medium">
              ALERT: there must be at least 1 product to complete the sale!
            </p>
          </div>
        </div>
      )}
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <h2 className="text-xl font-bold">List Product sale</h2>
        <div
          className={cn(
            "w-full my-5 flex justify-between items-center relative group",
            !input.buyer && "cursor-not-allowed"
          )}
        >
          <Label
            htmlFor="search"
            className="flex gap-2 absolute left-2 items-center"
          >
            <Badge className="bg-black text-xs hover:bg-black rounded-full text-white">
              Add Product
            </Badge>
          </Label>
          <TooltipProviderPage
            className={cn(!input.buyer ? "opacity-100" : "opacity-0")}
            value={<p>Select Buyer First.</p>}
          >
            <Input
              id="search"
              ref={addRef}
              className="rounded-r-none pl-28 focus-visible:ring-0 focus-visible:border focus-visible:border-sky-300 border-sky-300/80 disabled:opacity-100"
              autoFocus
              autoComplete="off"
              disabled={!input.buyer}
              value={dataSearchAddProduct}
              onChange={(e) => setDataSearchAddProduct(e.target.value)}
            />
          </TooltipProviderPage>
          <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={!input.buyer}
                className="bg-sky-300/80 w-10 p-0 hover:bg-sky-300 text-black rounded-l-none border border-sky-300/80 hover:border-sky-300 focus-visible:ring-0 disabled:opacity-100"
              >
                <Search className="w-4 h-4" />
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
                          loadingBuyer ? "animate-spin" : ""
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
                        {
                          // filtered.length > 0 ? (
                          dataProduct.length > 0 ? (
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
                                    onClick={() => {
                                      handleAddProduct(item.barcode);
                                      setIsBuyerOpen(false);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
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
                          )
                        }
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
                    <p className="text-sm">
                      Page {pageProduct.current} of {pageProduct.last}
                    </p>
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
          <TooltipProviderPage value={"Reload Data"} align="end">
            <Button
              onClick={(e) => {
                e.preventDefault();
                cookies.set("updateDataProduct", "update");
              }}
              className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50 ml-2"
              variant={"outline"}
            >
              <RefreshCw
                className={cn("w-4 h-4", loadingBuyer ? "animate-spin" : "")}
              />
            </Button>
          </TooltipProviderPage>
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
                {dataFilter.length > 0 ? (
                  dataFilter.map((item, i) => (
                    <div
                      className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">
                        {pageFilter.from + i}
                      </p>
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
                              documentId: "",
                              type: "create",
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
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-3 items-center">
            <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
              Total: {pageFilter.total}
            </Badge>
            <Badge className="rounded-full hover:bg-green-100 bg-green-100 text-black border border-green-500 text-sm">
              Row per page: {pageFilter.perPage}
            </Badge>
          </div>
          <div className="flex gap-5 items-center">
            <p className="text-sm">
              Page {pageFilter.current} of {pageFilter.last}
            </p>
            <div className="flex items-center gap-2">
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => {
                  setPageFilter((prev) => ({
                    ...prev,
                    current: prev.current - 1,
                  }));
                }}
                disabled={pageFilter.current === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => {
                  setPageFilter((prev) => ({
                    ...prev,
                    current: prev.current + 1,
                  }));
                }}
                disabled={pageFilter.current === pageFilter.last}
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

export default CreateClient;
