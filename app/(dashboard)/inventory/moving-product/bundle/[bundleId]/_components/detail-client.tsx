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
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpRightFromSquare,
  Barcode,
  ChevronDown,
  Circle,
  Edit2,
  FileDown,
  Grid2x2X,
  Loader2,
  PackageOpen,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
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
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/pagination";
import NotFound from "@/app/not-found";

const DetailClient = () => {
  const params = useParams();
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [is404, setIs404] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  // state search & page
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [data, setData] = useState<any>();
  const [product, setProduct] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [input, setInput] = useState({
    name: "",
    custom: "",
    total: "",
    category: "",
    color: "",
    barcode: "",
    prevTotal: 999999,
    prevCategory: "loading",
  });

  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/bundle/${params.bundleId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const dataRes = response.data.data.resource;
      setData(dataRes);
      setInput({
        name: dataRes.name_bundle,
        custom: Math.round(dataRes.total_price_custom_bundle).toString(),
        total: Math.round(dataRes.total_price_bundle).toString(),
        category: dataRes.category,
        color: dataRes.name_color,
        barcode: dataRes.barcode_bundle,
        prevTotal: Math.round(dataRes.total_price_bundle),
        prevCategory: dataRes.category,
      });
      setProduct(dataRes.product_bundles);
    } catch (err: any) {
      if (err.response.status === 404) {
        setIs404(true);
      }
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetProducts = async (p?: number) => {
    setLoadingProduct(true);
    try {
      const response = await axios.get(
        `${baseUrl}/new_product/display-expired?page=${
          p ?? page.current
        }&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProducts(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      toast.error("GET DATA: Something went wrong");
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingProduct(false);
    }
  };
  const handleGetCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(response.data.data.resource);
    } catch (err: any) {
      console.log("ERROR_GET_CATEGORY:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    setLoadingExport(true);
    try {
      const response = await axios.post(
        `${baseUrl}/exportBundlesDetail/${params.bundleId}`,
        {},
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
  const handleAddProduct = async (e: MouseEvent, id: number) => {
    e.preventDefault();
    setLoadingAdd(true);
    try {
      await axios.get(`${baseUrl}/product-bundle/${id}/${data?.id}/add`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully added in bundle.");
      cookies.set("detailProductBundle", "removed");
      cookies.set("detailBundle", "updated");
    } catch (err: any) {
      toast.error("Product failed to add in bundle.");
      console.log("ERROR_ADD_BUNDLE_PRODUCT:", err);
    } finally {
      setLoadingAdd(false);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      name_bundle: input.name,
      category: input.category,
      total_price_custom_bundle: input.custom,
      total_price_bundle: input.total,
      total_product_bundle: product.length,
    };
    try {
      await axios.put(`${baseUrl}/bundle/${params?.bundleId}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setInput({
        name: "",
        custom: "",
        total: "",
        category: "",
        color: "",
        barcode: "",
        prevTotal: 999999,
        prevCategory: "loading",
      });
      toast.success("Bundle successfully updated");
      cookies.set("detailBundle", "updated");
      setIsOpenEdit(false);
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Bundle failed to update");
      console.log("ERROR_UPDATE_BUNDLE:", err);
    }
  };

  // effect search & page data
  useEffect(() => {
    handleGetProducts(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageProductDetailBundle")) {
      handleGetProducts();
      return cookies.remove("pageProductDetailBundle");
    }
  }, [cookies.get("pageProductDetailBundle"), page.current]);

  useEffect(() => {
    if (cookies.get("detailProductBundle")) {
      handleGetProducts();
      return cookies.remove("detailProductBundle");
    }
  }, [cookies.get("detailProductBundle")]);
  useEffect(() => {
    if (cookies.get("detailBundle")) {
      handleGetData();
      return cookies.remove("detailBundle");
    }
  }, [cookies.get("detailBundle")]);

  useEffect(() => {
    if (
      input.prevTotal >= 100000 &&
      !input.prevCategory &&
      !isOpenEdit &&
      !isOpen
    ) {
      setIsOpenEdit(true);
    }
  }, [data, isOpenEdit, input, isOpen]);

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
    handleGetProducts();
    handleGetCategory();
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
          <BreadcrumbItem>Inventory</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/moving-product/bundle">
              Bundle
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/bundle">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail Bundle</h1>
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
          <div className="flex flex-col px-5">
            <p className="text-xs whitespace-nowrap">
              {data?.total_price_bundle >= 100000 ? "Category" : "Tag Color"}
            </p>
            {loading ? (
              <Skeleton className="w-32 h-4 mt-1" />
            ) : (
              <p className="font-medium text-sm whitespace-nowrap">
                {data?.total_price_bundle >= 100000 && !data.category && "-"}
                {data?.total_price_bundle >= 100000 &&
                  data.category &&
                  data?.category}
                {data?.total_price_bundle < 100000 &&
                  !data.category &&
                  data?.name_color}
              </p>
            )}
          </div>
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
          <div className="flex items-center gap-3 ml-3">
            <Dialog
              modal={false}
              open={isOpenEdit}
              onOpenChange={setIsOpenEdit}
            >
              <TooltipProviderPage value="Edit">
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="w-9 px-0 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:border-yellow-700 hover:text-yellow-700"
                  >
                    <Edit2 className="w-4 h-4 " />
                  </Button>
                </DialogTrigger>
              </TooltipProviderPage>
              <div
                className={cn(
                  "fixed bg-black/80 top-0 left-0 z-10 w-screen h-screen origin-center",
                  isOpenEdit ? "flex" : "hidden"
                )}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Bundle Data</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleEdit}
                  className="w-full flex flex-col gap-4"
                >
                  <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
                    <div className="flex flex-col gap-1 w-full">
                      <Label>Barcode</Label>
                      <Input
                        className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                        placeholder="Barcode bundle..."
                        value={input.barcode}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <Label>Bundle Name</Label>
                      <Input
                        className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                        placeholder="Bundle name..."
                        value={input.name}
                        // disabled={loadingSubmit}
                        onChange={(e) =>
                          setInput((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      {parseFloat(input.total) < 100000 ? (
                        <div className="flex flex-col gap-1 w-full">
                          <Label>Tag Color</Label>
                          <Input
                            className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                            value={
                              input.color ? input.color : "Add some product..."
                            }
                            disabled
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 w-full">
                          <Label>Category</Label>
                          <Popover
                            modal={true}
                            open={isOpenCategory}
                            onOpenChange={setIsOpenCategory}
                          >
                            <PopoverTrigger asChild>
                              <Button className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between">
                                <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start">
                                  {input.category
                                    ? input.category
                                    : "Select Category..."}
                                </p>
                                <ChevronDown className="size-4 flex-none" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput />
                                <CommandList className="p-1">
                                  <CommandEmpty>No Data Found.</CommandEmpty>
                                  <CommandGroup heading="List Categories">
                                    {categories.map((item: any) => (
                                      <CommandItem
                                        key={item.id}
                                        className="border border-gray-500 my-2 first:mt-0 last:mb-0 flex gap-2 items-center"
                                        onSelect={() => {
                                          setInput((prev) => ({
                                            ...prev,
                                            category: item.name_category,
                                            custom: (
                                              parseFloat(prev.total) -
                                              (parseFloat(prev.total) / 100) *
                                                item.discount_category
                                            ).toString(),
                                          }));
                                          setIsOpenCategory(false);
                                        }}
                                      >
                                        <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                                          {input.category ===
                                            item.name_category && (
                                            <Circle className="fill-black size-2.5" />
                                          )}
                                        </div>
                                        <div className="w-full flex flex-col gap-1">
                                          <div className="w-full font-medium">
                                            {item.name_category}
                                          </div>
                                          <Separator className="bg-gray-500" />
                                          <p className="text-xs text-start w-full text-gray-500">
                                            {item.discount_category +
                                              "% - Max. " +
                                              (formatRupiah(
                                                Math.round(
                                                  item.max_price_category
                                                )
                                              ) ?? "Rp 0")}
                                          </p>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-full relative">
                      <Label>Total Price</Label>
                      <Input
                        className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                        value={formatRupiah(parseFloat(input.total)) ?? "Rp 0"}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full relative">
                      <Label>Custom Price</Label>
                      <Input
                        className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                        placeholder="Rp 0"
                        value={input.custom}
                        type="number"
                        // disabled={loadingSubmit}
                        onChange={(e) =>
                          setInput((prev) => ({
                            ...prev,
                            custom: e.target.value.startsWith("0")
                              ? e.target.value.replace(/^0+/, "")
                              : e.target.value,
                          }))
                        }
                      />
                      <p className="absolute right-3 bottom-2 text-xs text-gray-400">
                        {formatRupiah(parseFloat(input.custom)) ?? "Rp 0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full gap-2">
                    <Button
                      className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
                      onClick={() => setIsOpenEdit(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className={cn(
                        "text-black w-full",
                        data
                          ? "bg-yellow-400 hover:bg-yellow-400/80"
                          : "bg-sky-400 hover:bg-sky-400/80"
                      )}
                      type="submit"
                      disabled={!input.name}
                    >
                      {data ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <TooltipProviderPage value="Barcode">
              <Button
                type="button"
                onClick={() =>
                  onOpen("barcode-printered-bundle-detail-modal", {
                    oldPrice: data?.total_price_bundle,
                    barcode: data?.barcode_bundle,
                    category: data?.name_bundle,
                    newPrice: data?.total_price_custom_bundle,
                  })
                }
                className="w-9 px-0 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700"
              >
                <Barcode className="w-4 h-4" />
              </Button>
            </TooltipProviderPage>
            <TooltipProviderPage value="Unbundle" align="end">
              <Button
                type="button"
                onClick={() =>
                  onOpen("destroy-bundle-modal", {
                    id: data?.id,
                    type: "detail",
                  })
                }
                className="w-9 px-0 bg-transparent border border-red-500 text-red-500 hover:bg-red-200 hover:border-red-700 hover:text-red-700"
              >
                <PackageOpen className="w-4 h-4 " />
              </Button>
            </TooltipProviderPage>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in Bundle
          </h2>
          <div className="flex gap-4">
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("detailBundle", "update");
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
                <Button className="hover:bg-sky-400 bg-sky-400/80 text-black">
                  Add Product
                  <ArrowUpRightFromSquare className="w-4 h-4 ml-2" />
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
                            products.length > 0 ? (
                              products.map((item, i) => (
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
                                    {formatRupiah(item.old_price_product) ??
                                      "Rp 0"}
                                  </p>
                                  <div className="w-24 ml-auto flex-none flex gap-4 justify-center">
                                    <Button
                                      className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                                      variant={"outline"}
                                      type="button"
                                      onClick={(e) =>
                                        handleAddProduct(e, item.id)
                                      }
                                    >
                                      {loadingAdd ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                      ) : (
                                        <PlusCircle className="w-4 h-4 mr-1" />
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
                    cookie="pageProductDetailBundle"
                  />
                </div>
              </DialogContent>
            </Dialog>
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
        <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
          <ScrollArea>
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-32 flex-none">Code Document</p>
              <p className="w-28 flex-none">Barcode</p>
              <p className="w-32 flex-none">Category</p>
              <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
              <p className="w-40 flex-none">Price</p>
              <p className="w-28 flex-none">Status</p>
              <p className="w-32 flex-none text-center">Action</p>
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
                    <div className="w-full min-w-72 max-w-[500px]">
                      <Skeleton className="h-4 w-52" />
                    </div>
                    <div className="w-40 flex-none">
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="w-28 flex-none">
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="w-32 flex-none flex justify-center">
                      <Skeleton className="h-4 w-28" />
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
                      value={
                        item.new_tag_product ?? item.new_category_product ?? "-"
                      }
                    >
                      <p className="w-32 flex-none whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.new_tag_product ??
                          item.new_category_product ??
                          "-"}
                      </p>
                    </TooltipProviderPage>
                    <TooltipProviderPage
                      value={<p className="w-72">{item.new_name_product}</p>}
                    >
                      <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
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
                    <div className="w-32 flex-none flex justify-center">
                      <Button
                        className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          onOpen("delete-product-bundle-modal", item.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <p>Remove</p>
                      </Button>
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
  );
};

export default DetailClient;
