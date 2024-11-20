"use client";

import NotFound from "@/app/not-found";
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
import { useModal } from "@/hooks/use-modal";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  Barcode,
  ChevronDown,
  Circle,
  Edit,
  FileDown,
  Loader2,
  Recycle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

const DetailClient = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const params = useParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [is404, setIs404] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [detailRepairs, setDetailRepairs] = useState<any>({}); // Menggunakan any sebagai tipe
  const [listDetailRepairs, setListDetailRepairs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [input, setInput] = useState({
    id: "",
    name: "",
    custom: "0",
    total: "0",
    qty: "0",
    discount: "0",
    category: "",
    barcode: "",
    hexa_code_color: "",
    name_color: "",
  });

  const handleClose = () => {
    if (isOpenEdit) {
      setIsOpenEdit(false);
      setInput({
        id: "",
        name: "",
        custom: "0",
        total: "0",
        qty: "0",
        discount: "0",
        category: "",
        barcode: "",
        hexa_code_color: "",
        name_color: "",
      });
    } else {
      setIsOpenEdit(true);
    }
  };

  // handle GET Data
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/repair-mv/${params.repairId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDetailRepairs(response.data.data.resource);
      setListDetailRepairs(response.data.data.resource.repair_products);
    } catch (err: any) {
      if (err.response.status === 404) {
        setIs404(true);
      }
      console.log("ERROR_GET_DOCUMENTS:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetail = async (e: MouseEvent, idProduct: any) => {
    e.preventDefault();
    setLoadingDetail(true);
    try {
      const response = await axios.get(
        `${baseUrl}/repair-product-mv/${idProduct}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      toast.success("Product data found");
      setInput((prev) => ({
        ...prev,
        id: dataRes.id,
        name: dataRes.new_name_product,
        custom: Math.round(dataRes.new_price_product).toString(),
        total: Math.round(dataRes.old_price_product).toString(),
        category: dataRes.new_category_product,
        name_color: dataRes.new_tag_product,
        barcode: dataRes.new_barcode_product,
        qty: dataRes.new_quantity_product,
      }));
      setIsOpenEdit(true);
    } catch (err: any) {
      toast.error("Product data not found");
      console.log("ERROR_GET_DOCUMENTS:", err);
    } finally {
      setLoadingDetail(false);
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
  const inputValue = useDebounce(input.total);
  const handleGetPrice = async () => {
    setLoadingPrice(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get-latestPrice?old_price_product=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      if (!dataRes.category) {
        setInput((prev) => ({
          ...prev,
          custom: dataRes.warna.fixed_price_color,
          hexa_code_color: dataRes.warna.hexa_code_color,
          name_color: dataRes.warna.name_color,
        }));
        setCategories([]);
      } else if (!dataRes.warna) {
        setCategories(dataRes.category);
        setInput((prev) => ({
          ...prev,
          hexa_code_color: "",
          name_color: "",
        }));
      }
    } catch (err: any) {
      toast.error("Something when wrong");
      console.log("ERROR_GET_PRICE_COLOR:", err);
    } finally {
      setLoadingPrice(false);
    }
  };
  const handleExport = async (e: MouseEvent) => {
    e.preventDefault();
    setLoadingExport(true);
    try {
      const response = await axios.post(
        `${baseUrl}/exportRepairDetail/${params.repairId}`,
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
      toast.error("Data failed to export.");
      console.log("ERROR_EXPORT:", err);
    } finally {
      setLoadingExport(false);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      new_barcode_product: input.barcode,
      new_name_product: input.name,
      new_quantity_product: input.qty,
      old_price_product: input.total,
      new_category_product: !input.name_color ? input.category : "",
      new_tag_product: input.name_color ? input.name_color : "",
    };
    try {
      await axios.put(`${baseUrl}/product-repair/${input.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Bundle successfully updated");
      cookies.set("detailRepairPage", "updated");
      setIsOpenEdit(false);
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Bundle failed to update");
      console.log("ERROR_UPDATE_BUNDLE:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.qty))) {
      setInput((prev) => ({ ...prev, qty: "0" }));
    }
    if (isNaN(parseFloat(input.total))) {
      setInput((prev) => ({ ...prev, total: "0" }));
    }
    if (isNaN(parseFloat(input.custom))) {
      setInput((prev) => ({ ...prev, custom: "0" }));
    }
  }, [input]);

  useEffect(() => {
    if (cookies.get("detailRepairPage")) {
      handleGetData();
      return cookies.remove("detailRepairPage");
    }
  }, [cookies.get("detailRepairPage")]);

  useEffect(() => {
    if (isOpenEdit) {
      handleGetPrice();
    }
  }, [inputValue]);

  useEffect(() => {
    handleGetData();
    handleGetCategory();
    setIsMounted(true);
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
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/moving-product/repair">
              Repair
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/repair">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Detail Repair</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <h5 className="font-medium">{detailRepairs?.barcode}</h5>
            <h3 className="text-xl font-semibold capitalize">
              {detailRepairs.repair_name}
            </h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Total Price</p>
            <p className="font-medium text-sm">
              {formatRupiah(detailRepairs.total_price)}
            </p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <div className="flex flex-col w-72 pl-5">
            <p className="text-xs">Custom Display</p>
            <p className="font-medium text-sm">
              {formatRupiah(detailRepairs.total_custom_price)}
            </p>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <Button
            className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700"
            onClick={() =>
              onOpen("barcode-printered-moving-product-detail-repair", {
                barcode: detailRepairs.barcode,
                oldPrice: detailRepairs.total_price,
                newPrice: detailRepairs.total_custom_price,
                category: detailRepairs.repair_name, // Assuming you can fetch or define the category here
              })
            }
          >
            <Barcode className="w-4 h-4 mr-1" />
            Barcode
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-6 flex-col">
        <div className="w-full flex justify-between pt-3 items-center">
          <h2 className="text-xl font-semibold border-b border-gray-500 pr-10">
            List Products in Repair
          </h2>
          <div className="flex gap-4">
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("detailRepairPage", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50 disabled:opacity-100"
                variant={"outline"}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("w-4 h-4", loading ? "animate-spin" : "")}
                />
              </Button>
            </TooltipProviderPage>
            <Button
              onClick={handleExport}
              className="bg-sky-400/80 hover:bg-sky-400 text-black disabled:opacity-100"
              disabled={loadingExport}
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
                <p className="w-32 flex-none">Barcode</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                <p className="w-16 flex-none">Qty</p>
                <p className="w-44 flex-none">Price</p>
                <p className="w-20 flex-none">Status</p>
                <p className="w-[330px] text-center flex-none">Action</p>
              </div>
              {loading ? (
                <div className="w-full">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex items-center flex-none">
                        <Skeleton className="h-4 w-7" />
                      </div>
                      <div className="w-32 flex-none">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="w-full min-w-72 max-w-[500px]">
                        <Skeleton className="h-4 w-72" />
                      </div>
                      <div className="w-16 flex-none">
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <div className="w-44 flex-none">
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="w-20 flex-none">
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="w-[330px] flex-none flex gap-4 justify-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {listDetailRepairs.map((item: any, i: any) => (
                    <div
                      className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <p className="w-10 text-center flex-none">{i + 1}</p>
                      <p className="w-32 flex-none">
                        {item.new_barcode_product}
                      </p>
                      <TooltipProviderPage
                        value={<p className="w-72">{item.new_name_product}</p>}
                      >
                        <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.new_name_product}
                        </p>
                      </TooltipProviderPage>
                      <div className="w-16 flex-none">
                        {item.new_quantity_product}
                      </div>
                      <div className="w-44 flex-none">
                        {formatRupiah(item.new_price_product) ?? "Rp 0"}
                      </div>
                      <div className="w-20 flex-none">
                        <Badge className="bg-sky-300 hover:bg-sky-300 text-black capitalize">
                          {item.new_status_product}
                        </Badge>
                      </div>
                      <div className="w-[330px] flex-none flex gap-4 justify-center">
                        <Button
                          className="items-center border-yellow-400 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-50"
                          variant={"outline"}
                          type="button"
                          onClick={(e) => {
                            handleGetDetail(e, item.id);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <div>Edit</div>
                        </Button>
                        <Button
                          className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("display-product-detail-repair-modal", {
                              id: item.id,
                              last: listDetailRepairs.length === 1,
                            })
                          }
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          <div>To Display</div>
                        </Button>
                        <Button
                          className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("qcd-product-detail-repair-modal", {
                              id: item.id,
                              last: listDetailRepairs.length === 1,
                            })
                          }
                        >
                          <Recycle className="w-4 h-4 mr-1" />
                          <div>QCD</div>
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
      <Dialog modal={false} open={isOpenEdit} onOpenChange={handleClose}>
        <div
          className={cn(
            "fixed bg-black/80 top-0 left-0 z-10 w-screen h-screen origin-center",
            isOpenEdit ? "flex" : "hidden"
          )}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Data</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="w-full flex flex-col gap-4">
            <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
              <div className="flex flex-col gap-1 w-full">
                <Label>Barcode</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Barcode product..."
                  value={input.barcode}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Label>Product Name</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Product name..."
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
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Qty</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Rp 0"
                  value={input.qty}
                  type="number"
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      qty: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full relative">
                <Label>Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Rp 0"
                  value={input.total}
                  type="number"
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      total: e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                      custom:
                        parseFloat(e.target.value) >= 100000
                          ? (
                              parseFloat(e.target.value) -
                              (parseFloat(e.target.value) / 100) *
                                parseFloat(input.discount)
                            ).toString()
                          : prev.custom,
                    }))
                  }
                />
                <p className="absolute right-3 bottom-2 text-xs text-gray-400">
                  {formatRupiah(parseFloat(input.total)) ?? "Rp 0"}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                {input.name_color ? (
                  <div className="flex flex-col gap-1 w-full">
                    <Label>Tag Color</Label>
                    <Input
                      className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                      value={input.name_color}
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
                                      discount: item.discount_category,
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
              </div>
              <div className="flex flex-col gap-1 w-full relative">
                <Label>New Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  value={formatRupiah(parseFloat(input.custom)) ?? "Rp 0"}
                  disabled
                />
              </div>
            </div>
            <div className="flex w-full gap-2">
              <Button
                className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="text-black w-full bg-yellow-400 hover:bg-yellow-400/80"
                type="submit"
                disabled={!input.name}
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailClient;
