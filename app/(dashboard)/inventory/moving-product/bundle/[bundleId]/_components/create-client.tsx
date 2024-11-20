"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
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
  ArrowLeft,
  ArrowUpRightFromSquare,
  ChevronDown,
  Circle,
  Grid2x2X,
  Loader2,
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
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useModal } from "@/hooks/use-modal";
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
import { Separator } from "@/components/ui/separator";
import Pagination from "@/components/pagination";

const CreateClient = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();

  // state bool
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);

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
  const [pageFiltered, setPageFiltered] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [input, setInput] = useState({
    name: "",
    category: "",
    color: "",
    total: "0",
    custom: "0",
    fix: "0",
  });
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dataFiltered, setDataFiltered] = useState<any[]>([]);

  // handle GET Data
  const handleGetData = async (p?: number) => {
    setLoading(true);
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
      setData(response.data.data.resource.data);
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
      setLoading(false);
    }
  };
  const handleGetDataFiltered = async () => {
    setLoadingFiltered(true);
    try {
      const response = await axios.get(
        `${baseUrl}/bundle/filter_product?page=${page.current}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setDataFiltered(dataRes.data.data);
      setPageFiltered({
        current: dataRes.data.current_page ?? 1,
        last: dataRes.data.last_page ?? 1,
        from: dataRes.data.from ?? 0,
        total: dataRes.data.total ?? 0,
        perPage: dataRes.data.per_page ?? 0,
      });
      setInput((prev) => ({
        ...prev,
        total: Math.round(dataRes.total_new_price).toString(),
        custom: !dataRes.category
          ? Math.round(dataRes.fixed_price).toString()
          : Math.round(dataRes.total_new_price).toString(),
        fix: Math.round(dataRes.fixed_price).toString() ?? "0",
        color: dataRes.color ?? "",
      }));
      setCategories(dataRes.category ?? []);
      if (!dataRes.category) {
        setInput((prev) => ({
          ...prev,
          category: "",
        }));
      } else {
        setInput((prev) => ({
          ...prev,
          color: "",
          fix: "0",
        }));
      }
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingFiltered(false);
    }
  };

  // handle Add
  const handleAddProduct = async (e: MouseEvent, id: number) => {
    e.preventDefault();
    setLoadingAdd(true);
    try {
      await axios.post(
        `${baseUrl}/bundle/filter_product/${id}/add`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully added to filter.");
      cookies.set("createBundleFiltered", "removed");
      cookies.set("createBundle", "updated");
    } catch (err: any) {
      console.log("ERROR_ADD_FILTER_PRODUCT:", err);
    } finally {
      setLoadingAdd(false);
    }
  };

  // handle Delete
  const handleDeleteProduct = async (e: MouseEvent, id: number) => {
    e.preventDefault();
    setLoadingRemove(true);
    try {
      await axios.delete(`${baseUrl}/bundle/filter_product/destroy/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully removed from filter.");
      cookies.set("createBundleFiltered", "removed");
      cookies.set("createBundle", "removed");
    } catch (err: any) {
      console.log("ERROR_REMOVE_FILTER_PRODUCT:", err);
    } finally {
      setLoadingRemove(false);
    }
  };

  // handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const body = {
      category: input.category,
      name_color: input.color,
      name_bundle: input.name,
      total_price_bundle: input.total,
      total_price_custom_bundle: input.custom,
      total_product_bundle: dataFiltered.length,
    };
    try {
      const response = await axios.post(`${baseUrl}/bundle`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success(
        response.data.data.message ?? "Bundle successfully created."
      );
      router.push("/inventory/moving-product/bundle");
    } catch (err: any) {
      toast.error(err.response.data.message ?? "Bundle failed to create.");
      console.log("ERROR_CREATE_BUNDLE:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // autoFill 0
  useEffect(() => {
    if (isNaN(parseFloat(input.custom))) {
      setInput((prev) => ({ ...prev, custom: "0" }));
    }
  }, [input]);

  // effect search & page data
  useEffect(() => {
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageCreateBundle")) {
      handleGetData();
      return cookies.remove("pageCreateBundle");
    }
  }, [cookies.get("pageCreateBundle"), page.current]);
  useEffect(() => {
    handleGetDataFiltered();
  }, [pageFiltered.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("createBundleFiltered")) {
      handleGetDataFiltered();
      return cookies.remove("createBundleFiltered");
    }
  }, [cookies.get("createBundleFiltered")]);
  useEffect(() => {
    if (cookies.get("createBundle")) {
      handleGetData();
      return cookies.remove("createBundle");
    }
  }, [cookies.get("createBundle")]);

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
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/bundle">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create Bundle List</h1>
      </div>
      <div className="w-full flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-4 bg-white p-5 rounded-md shadow"
        >
          <div className="w-full pb-1 mb-2 border-b border-gray-500 text-xl font-semibold">
            <h3>Data Bundle</h3>
          </div>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-1 w-1/3 flex-none">
              <Label>Bundle Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="Bundle name..."
                value={input.name}
                disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              {parseFloat(input.total) < 100000 ? (
                <div className="flex flex-col gap-1 w-full">
                  <Label>Tag Color</Label>
                  <Input
                    className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                    value={input.color ? input.color : "Add some product..."}
                    disabled
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <Label>Category</Label>
                  <Popover
                    open={isOpenCategory}
                    onOpenChange={setIsOpenCategory}
                  >
                    <TooltipProviderPage
                      value={
                        input.category ? input.category : "Select Category..."
                      }
                      side="bottom"
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
                    </TooltipProviderPage>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput />
                        <CommandList className="p-1">
                          <CommandEmpty>No Data Found.</CommandEmpty>
                          <CommandGroup heading="List Categories">
                            {categories.map((item) => (
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
                                  {input.category === item.name_category && (
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
                                        Math.round(item.max_price_category)
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
              <div className="flex flex-col gap-1 w-full">
                <Label>Total Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Rp. 0,00"
                  value={
                    formatRupiah(Math.round(parseFloat(input.total))) ?? "Rp 0"
                  }
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Label>Custom Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0,00"
                  type="number"
                  value={input.custom}
                  disabled={loadingSubmit}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      custom: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                !input.name ||
                dataFiltered.length === 0 ||
                loadingSubmit ||
                parseFloat(input.total) < 100000
                  ? !input.color
                  : !input.category
              }
              className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto"
            >
              {loadingSubmit ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Send className="w-4 h-4 mr-1" />
              )}
              Create
            </Button>
          </div>
        </form>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center gap-4">
          <h3 className="border-b border-gray-500 pr-10 pb-1 w-fit">
            List Products Filtered
          </h3>
          <div className="flex gap-4">
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("createBundleFiltered", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                variant={"outline"}
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4",
                    loadingFiltered ? "animate-spin" : ""
                  )}
                />
              </Button>
            </TooltipProviderPage>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
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
                          cookies.set("createBundle", "update");
                        }}
                        className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <RefreshCw
                          className={cn(
                            "w-4 h-4",
                            loading ? "animate-spin" : ""
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
                      {loading ? (
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
                            data.length > 0 ? (
                              data.map((item, i) => (
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
                    cookie="pageCreateBundle"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-48 flex-none">Barcode</p>
                <p className="w-full min-w-96 max-w-[800px]">Product Name</p>
                <p className="w-24 text-center flex-none ml-auto">Action</p>
              </div>
              {loadingFiltered ? (
                <div className="w-full">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-48 flex-none">
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <div className="w-full min-w-96 max-w-[800px]">
                        <Skeleton className="w-96 h-4" />
                      </div>
                      <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {dataFiltered.length > 0 ? (
                    dataFiltered.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {pageFiltered.from + i}
                        </p>
                        <p className="w-48 flex-none overflow-hidden text-ellipsis">
                          {item.new_barcode_product ?? item.old_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-auto max-w-72 ">
                              {item.new_name_product}
                            </p>
                          }
                        >
                          <p className="w-full min-w-96 max-w-[800px] whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                          <Button
                            className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleDeleteProduct(e, item.id)}
                            disabled={loadingRemove}
                          >
                            {loadingRemove ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
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
          <Pagination
            pagination={pageFiltered}
            setPagination={setPageFiltered}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
