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
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  Percent,
  PlusCircle,
  ReceiptText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Pagination from "@/components/pagination";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

export const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPromo, setIsOpenPromo] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const { onOpen } = useModal();

  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  const [dataSearchProducts, setDataSearchProducts] = useState("");
  const searchValueProducts = useDebounce(dataSearchProducts);
  const [pageProducts, setPageProducts] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  const [input, setInput] = useState({
    id: "",
    name: "",
    discount: "0",
    price: 0,
  });

  const [data, setData] = useState<any[]>([]);
  const [dataProducts, setDataProducts] = useState<any[]>([]);

  const handleGetData = async (p?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/promo?page=${p ?? page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setData(dataRes.data);
      setPage({
        current: dataRes.current_page ?? 1,
        last: dataRes.last_page ?? 1,
        from: dataRes.from ?? 0,
        total: dataRes.total ?? 0,
        perPage: dataRes.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetProducts = async (p?: any) => {
    setLoadingProduct(true);
    try {
      const response = await axios.get(
        `${baseUrl}/new_product/display-expired?page=${
          p ?? pageProducts.current
        }&q=${searchValueProducts}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setDataProducts(dataRes.data);
      setPageProducts({
        current: dataRes.current_page ?? 1,
        last: dataRes.last_page ?? 1,
        from: dataRes.from ?? 0,
        total: dataRes.total ?? 0,
        perPage: dataRes.per_page ?? 0,
      });
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingProduct(false);
    }
  };
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      discount_promo: input.discount,
      name_promo: input.name,
      new_product_id: input.id,
      price_promo:
        input.price - (input.price / 100) * parseFloat(input.discount),
    };
    try {
      await axios.post(`${baseUrl}/promo`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Promo successfully created");
      router.push("/inventory/slow-moving-product/promo-product");
      cookies.set("listProductMV", "created");
      cookies.set("productProductMV", "created");
      setIsOpenPromo(false);
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Promo failed to create");
      console.log("ERROR_UPDATE_BUNDLE:", err);
    }
  };
  const handleGetDetail = async (e: MouseEvent, idItem: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${baseUrl}/promo/${idItem}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Data successfully found");
      const dataRes = response.data.data.resource;
      onOpen("detail-promo-modal", dataRes);
    } catch (err: any) {
      toast.success("Data failed to be found");
      console.log("ERROR_GET_DETAIL:", err);
    } finally {
      setLoadingDetail(false);
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
          url: "/inventory/slow-moving-product/promo-product",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (isNaN(parseFloat(input.discount))) {
      setInput((prev) => ({ ...prev, discount: "0" }));
    }
  }, [input]);

  // effect search & page data
  useEffect(() => {
    handleCurrentId(searchValue);
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageListProductMV")) {
      handleCurrentId(searchValue);
      handleGetData();
      return cookies.remove("pageListProductMV");
    }
  }, [cookies.get("pageListProductMV"), page.current]);
  useEffect(() => {
    handleGetProducts(1);
  }, [searchValueProducts]);
  useEffect(() => {
    if (cookies.get("pageProductProductMV")) {
      handleGetProducts();
      return cookies.remove("pageProductProductMV");
    }
  }, [cookies.get("pageProductProductMV"), pageProducts.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("listProductMV")) {
      handleGetData();
      return cookies.remove("listProductMV");
    }
  }, [cookies.get("listProductMV")]);
  useEffect(() => {
    if (cookies.get("productProductMV")) {
      handleGetProducts();
      return cookies.remove("productProductMV");
    }
  }, [cookies.get("productProductMV")]);

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
          <BreadcrumbItem>Slow Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>List Promo Products</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Promo Products</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex gap-4 items-center">
              <TooltipProviderPage value={"Reload Data"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    cookies.set("listProductMV", "update");
                  }}
                  className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                  variant={"outline"}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                  />
                </Button>
              </TooltipProviderPage>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Promo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[75vw] w-full flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="justify-between flex items-center">
                      List Product
                      <TooltipProviderPage value="close" side="left">
                        <button
                          onClick={() => setIsOpen(false)}
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
                          value={dataSearch}
                          onChange={(e) => setDataSearch(e.target.value)}
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
                            cookies.set("detailProductBundle", "update");
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
                          <p className="w-36 flex-none">Barcode</p>
                          <p className="w-full min-w-52 max-w-[450px]">
                            Product Name
                          </p>
                          <p className="w-44 flex-none">Category</p>
                          <p className="w-32 flex-none">Price</p>
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
                                <div className="w-36 flex-none">
                                  <Skeleton className="w-28 h-4" />
                                </div>
                                <div className="w-full min-w-52 max-w-[450px]">
                                  <Skeleton className="w-44 h-4" />
                                </div>
                                <div className="w-32 flex-none">
                                  <Skeleton className="w-24 h-4" />
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
                              dataProducts.length > 0 ? (
                                dataProducts.map((item, i) => (
                                  <div
                                    className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                                    key={item.id}
                                  >
                                    <p className="w-10 text-center flex-none">
                                      {page.from + i}
                                    </p>
                                    <TooltipProviderPage
                                      value={
                                        item.new_barcode_product ??
                                        item.old_barcode_product
                                      }
                                    >
                                      <p className="w-36 flex-none overflow-hidden text-ellipsis">
                                        {item.new_barcode_product ??
                                          item.old_barcode_product}
                                      </p>
                                    </TooltipProviderPage>
                                    <TooltipProviderPage
                                      value={
                                        <p className="w-auto max-w-52 ">
                                          {item.new_name_product}
                                        </p>
                                      }
                                    >
                                      <p className="w-full min-w-52 max-w-[450px] whitespace-nowrap text-ellipsis overflow-hidden">
                                        {item.new_name_product}
                                      </p>
                                    </TooltipProviderPage>
                                    <TooltipProviderPage
                                      value={
                                        item.new_category_product ??
                                        item.new_tag_product
                                      }
                                    >
                                      <p className="w-44 flex-none whitespace-nowrap text-ellipsis overflow-hidden">
                                        {item.new_category_product ??
                                          item.new_tag_product}
                                      </p>
                                    </TooltipProviderPage>
                                    <p className="w-32 flex-none">
                                      {formatRupiah(item.new_price_product) ??
                                        "Rp 0"}
                                    </p>
                                    <div className="w-24 ml-auto flex-none flex gap-4 justify-center">
                                      <Button
                                        className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                                        variant={"outline"}
                                        type="button"
                                        onClick={(e) => {
                                          setInput((prev) => ({
                                            ...prev,
                                            id: item.id,
                                            price: item.new_price_product,
                                          }));
                                          setIsOpenPromo(true);
                                          setIsOpen(false);
                                        }}
                                      >
                                        <PlusCircle className="w-4 h-4 mr-1" />
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
                    <Pagination
                      pagination={page}
                      setPagination={setPage}
                      cookie="pageProductProductMV"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="min-w-44 w-full max-w-[250px]">Promo Name</p>
                <p className="w-36 flex-none">Barcode Product</p>
                <p className="min-w-72 w-full max-w-[500px]">Name Product</p>
                <p className="w-40 flex-none">Category</p>
                <p className="w-16 flex-none">Qty</p>
                <p className="w-44 flex-none">Price</p>
                <p className="w-44 flex-none">Promo Price</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-28 text-center flex-none">Action</p>
              </div>

              {loading ? (
                <div className="w-full min-h-[300px]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="h-4 w-7" />
                      </div>
                      <div className="min-w-44 w-full max-w-[250px]">
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="w-36 flex-none">
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="min-w-72 w-full max-w-[500px]">
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <div className="w-40 flex-none">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="w-16 flex-none">
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="w-28 flex-none">
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="w-28 flex-none flex gap-4 justify-center">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                        key={i}
                      >
                        <p className="w-10 text-center flex-none">
                          {page.from + i}
                        </p>
                        <TooltipProviderPage
                          value={<p className="w-44">{item.name_promo}</p>}
                        >
                          <p className="min-w-44 w-full max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.name_promo}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-36 flex-none">
                          {item.new_product.new_barcode_product ??
                            item.new_product.old_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-72">
                              {item.new_product.new_name_product}
                            </p>
                          }
                        >
                          <p className="min-w-72 w-full max-w-[500px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.new_product.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <TooltipProviderPage
                          value={
                            <p className="w-40">
                              {item.new_product.new_category_product ??
                                item.new_product.new_tag_product}
                            </p>
                          }
                        >
                          <p className="w-40 flex-none text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.new_product.new_category_product ??
                              item.new_product.new_tag_product}
                          </p>
                        </TooltipProviderPage>
                        <p className="w-16 flex-none">
                          {item.new_product.new_quantity_product}
                        </p>
                        <p className="w-44 flex-none">
                          {formatRupiah(item.new_product.new_price_product) ??
                            "Rp 0"}
                        </p>
                        <p className="w-44 flex-none">
                          {formatRupiah(item.price_promo) ?? "Rp 0"}
                        </p>
                        <div className="w-28 flex-none">
                          <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-sky-300 hover:bg-sky-300">
                            {item.new_product.new_status_product}
                          </Badge>
                        </div>
                        <div className="w-28 flex-none flex gap-4 justify-center">
                          <Button
                            className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleGetDetail(e, item.id)}
                          >
                            <ReceiptText className="w-4 h-4 mr-1" />
                            <p>Detail</p>
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
          <Pagination
            pagination={page}
            setPagination={setPage}
            cookie="pageListProductMV"
          />
        </div>
      </div>
      <Dialog open={isOpenPromo} onOpenChange={setIsOpenPromo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Promo Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex w-full flex-col gap-4">
            <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Promo Name</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Promo name..."
                  value={input.name}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Discount</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0"
                  value={input.discount}
                  type="number"
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      discount: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
                <Percent className="size-4 absolute bottom-2 right-3" />
              </div>
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Price After Promo</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  value={formatRupiah(
                    input.price -
                      (input.price / 100) * parseFloat(input.discount)
                  )}
                  disabled
                />
              </div>
            </div>
            <div className="flex w-full gap-2">
              <Button
                className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
                onClick={() => setIsOpenPromo(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="text-black w-full bg-sky-400 hover:bg-sky-400/80"
                type="submit"
                disabled={!input.name}
              >
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
