"use client";
import React, { useEffect, useState } from "react";
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
  ArrowLeftRight,
  ArrowRight,
  Ban,
  CheckCircle2,
  Grid2x2X,
  Loader2,
  MapPinned,
  PlusCircle,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCookies } from "next-client-cookies";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Loading from "../loading";
import { useModal } from "@/hooks/use-modal";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const Client = () => {
  const { onOpen } = useModal();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenColor, setIsOpenColor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [destinations, setDestinations] = useState<any[]>([]);
  const [colorCount, setColorCount] = useState<any[]>([]);
  const [data, setData] = useState<any>();
  const [input, setInput] = useState({
    destination: "",
    color: "",
    count: 0,
    qty: "0",
  });

  // handle GET Data
  const handleGetDestinations = async () => {
    try {
      const response = await axios.get(`${baseUrl}/destinations`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDestinations(response.data.data.resource.data);
    } catch (err: any) {
      toast.error(
        `Error ${err.response?.status ?? 500}: Destinations failed to found.`
      );
      console.log("ERROR_GET_DOCUMENT:", err);
    }
  };
  const handleGetColorCount = async () => {
    try {
      const response = await axios.get(`${baseUrl}/countColor`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setColorCount(
        Object.entries(response.data.data.resource).map(([key, value]) => ({
          name: key.toLowerCase(), // Convert key to lowercase
          value: value,
        }))
      );
    } catch (err: any) {
      toast.error(
        `Error ${err.response?.status ?? 500}: Color failed to found.`
      );
      console.log("ERROR_GET_COLOR_COUNT:", err);
    }
  };
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/displayMigrate`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data.data.resource.data);
      setInput((prev) => ({
        ...prev,
        destination: response.data.data.resource.data.destiny_document_migrate,
      }));
    } catch (err: any) {
      toast.error(
        `Error ${err.response?.status ?? 500}: Data failed to found.`
      );
      console.log("ERROR_GET_DATA:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleAddProduct = async () => {
    setLoadingAdd(true);
    const body = {
      destiny_document_migrate: input.destination,
      product_color: input.color,
      product_total: input.qty,
    };
    try {
      const response = await axios.post(`${baseUrl}/migrates`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product Added to List Product Migrate");
      cookies.set("updateDataProduct", "updated");
      setInput({
        color: "",
        count: 0,
        qty: "",
        destination: "",
      });
    } catch (err: any) {
      toast.error(
        `Error ${err.response?.status ?? 500}: Product failed to add.`
      );
      console.log("ERROR_ADD_DATA:", err);
    } finally {
      setLoadingAdd(false);
    }
  };
  const handleCreate = async () => {
    setLoadingCreate(true);

    try {
      const response = await axios.post(
        `${baseUrl}/migrate-finish`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Migrate successfully created");
      router.push("/outbond/migrate-color/list");
    } catch (err: any) {
      toast.error(
        `Error ${err.response?.status ?? 500}: Migrate failed to create.`
      );
      console.log("ERROR_ADD_DATA:", err);
    } finally {
      setLoadingCreate(false);
    }
  };

  useEffect(() => {
    if (cookies.get("updateDataProduct")) {
      handleGetData();
      return cookies.remove("updateDataProduct");
    }
  }, [cookies.get("updateDataProduct")]);

  useEffect(() => {
    if (isNaN(parseFloat(input.qty))) {
      setInput((prev) => ({ ...prev, qty: "0" }));
    }
  }, [input.qty]);

  useEffect(() => {
    handleGetDestinations();
    handleGetColorCount();
    handleGetData();
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
          <BreadcrumbItem>Outbond</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/outbond/migrate-color/list">
              Migrate Color
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/outbond/migrate-color/list">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create Migrate</h1>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full flex items-center">
          <div className="flex items-center w-full gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100">
              <MapPinned className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold capitalize">
              {input.destination ? (
                <span>{input.destination}</span>
              ) : (
                <span className="italic">Not Selected.</span>
              )}
            </h3>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-12" />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "ml-5 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:border-yellow-700 hover:text-yellow-700 disabled:opacity-100 disabled:cursor-not-allowed"
                )}
                disabled={data?.destiny_document_migrate}
              >
                {data?.destiny_document_migrate ? (
                  <Ban className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowLeftRight className="w-4 h-4 mr-1" />
                )}
                Change Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="p-5 max-w-sm">
              <DialogHeader>
                <DialogTitle className="justify-between flex items-center">
                  Select Destination
                  <TooltipProviderPage value="close" side="left">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-6 h-6 flex items-center justify-center border border-black hover:bg-gray-100 rounded-full"
                      autoFocus={false}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </TooltipProviderPage>
                </DialogTitle>
              </DialogHeader>
              <Command>
                <CommandInput placeholder="Search destination..." autoFocus />
                <CommandList className="min-h-[200px]">
                  <CommandGroup>
                    {destinations.map((item, i) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          setInput((prev) => ({
                            ...prev,
                            destination: item.shop_name,
                          }));
                          setIsOpen(false);
                        }}
                        className="py-2.5 px-3 capitalize"
                      >
                        <CheckCircle2
                          className={cn(
                            "fill-black stroke-white mr-2 w-5 h-5",
                            input.destination === item.shop_name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.shop_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleCreate}
            disabled={loadingCreate || !data?.migrates}
            className="ml-3 bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-200 hover:border-sky-700 hover:text-sky-700 disabled:opacity-100"
          >
            {loadingCreate && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            {!data?.migrates && <Ban className="w-4 h-4 mr-1" />}
            {!loadingCreate && data?.migrates && (
              <Send className="w-4 h-4 mr-1" />
            )}
            Send
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col gap-5">
        <div className="w-full text-xl font-semibold flex justify-between items-center">
          <h3 className="border-b border-gray-500 pr-10 pb-1">Add Product</h3>
        </div>
        <div className="w-full flex items-center">
          <div className="flex items-center w-full gap-4">
            <div className="border p-3 rounded border-sky-500 relative w-2/3 flex gap-4 flex-none items-center">
              <p className="absolute -top-3 left-5 font-semibold text-sm bg-white px-3">
                From The Product
              </p>
              {input.color && input.count ? (
                <>
                  <div className="flex flex-col gap-1 mt-2 w-2/3">
                    <Label>Color</Label>
                    <div className="w-full h-9 border border-sky-500 rounded px-3 items-center flex text-sm capitalize cursor-not-allowed">
                      {input.color}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2 w-1/3 ">
                    <Label>Qty</Label>
                    <div className="w-full h-9 border border-sky-500 rounded px-3 items-center flex text-sm cursor-not-allowed">
                      {input.count.toLocaleString()}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-lg font-semibold italic mt-2 w-full pl-2 h-16 flex items-center">
                  Color Not Selected.
                </p>
              )}
              <Dialog open={isOpenColor} onOpenChange={setIsOpenColor}>
                <TooltipProviderPage value="Change Color">
                  <DialogTrigger asChild>
                    <Button
                      size={"icon"}
                      className="flex-none mt-auto disabled:opacity-100"
                      disabled={loadingAdd}
                    >
                      <RefreshCw
                        className={cn(
                          "w-4 h-4",
                          loadingAdd ? "animate-spin" : ""
                        )}
                      />
                    </Button>
                  </DialogTrigger>
                </TooltipProviderPage>
                <DialogContent className="p-5 max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="justify-between flex items-center">
                      Select Destination
                      <TooltipProviderPage value="close" side="left">
                        <button
                          onClick={() => setIsOpenColor(false)}
                          className="w-6 h-6 flex items-center justify-center border border-black hover:bg-gray-100 rounded-full"
                          autoFocus={false}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </TooltipProviderPage>
                    </DialogTitle>
                  </DialogHeader>
                  <Command>
                    <CommandInput
                      placeholder="Search destination..."
                      autoFocus
                    />
                    <CommandList className="min-h-[200px]">
                      <CommandGroup>
                        {colorCount.map((item, i) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              setInput((prev) => ({
                                ...prev,
                                color: item.name,
                                count: item.value,
                              }));
                              setIsOpenColor(false);
                            }}
                            className="py-2.5 px-3 capitalize"
                          >
                            <CheckCircle2
                              className={cn(
                                "fill-black stroke-white mr-2 w-5 h-5",
                                input.color === item.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex items-center justify-between w-full">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.value.toLocaleString()} Products
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-sky-100 flex-none">
              <ArrowRight className="w-4 h-4 " />
            </div>
            <div className="border p-3 rounded border-sky-500 relative w-full flex gap-4">
              <p className="absolute -top-3 left-5 font-semibold text-sm bg-white px-3">
                Amount to be sent
              </p>
              <div className="flex flex-col gap-1 mt-2 w-full ">
                <Label>Qty</Label>
                <Input
                  type="number"
                  className="border-sky-400/80 focus-visible:ring-sky-400 w-full"
                  value={input.qty}
                  disabled={loadingAdd}
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
            </div>
          </div>
          <Separator orientation="vertical" className="bg-gray-500 h-24 mx-4" />
          <Button
            onClick={handleAddProduct}
            disabled={
              loadingAdd ||
              !input.color ||
              !input.count ||
              !input.destination ||
              !input.qty ||
              parseFloat(input.qty) === 0
            }
            className="bg-sky-300/80 hover:bg-sky-300 text-black disabled:opacity-100"
          >
            {loadingAdd && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            {(!input.color ||
              !input.count ||
              !input.destination ||
              !input.qty ||
              parseFloat(input.qty) === 0) && <Ban className="w-4 h-4 mr-1" />}
            {!loadingAdd &&
              input.color &&
              input.count &&
              input.destination &&
              input.qty &&
              parseFloat(input.qty) > 0 && (
                <PlusCircle className="w-4 h-4 mr-1" />
              )}
            Add
          </Button>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 flex-col">
        <div className="w-full mb-5 text-xl font-semibold flex justify-between items-center">
          <h3 className="border-b border-gray-500 pr-10 pb-1">List Products</h3>
        </div>
        <div className="w-full p-4 rounded-md border border-sky-400/80">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full">Color</p>
            <p className="w-24 flex-none">Total</p>
            <p className="w-28 flex-none">Status</p>
            <p className="w-32 text-center flex-none">Action</p>
          </div>
          {loading ? (
            <div className="w-full">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={i}
                >
                  <div className="w-10 flex justify-center flex-none">
                    <Skeleton className="w-7 h-4" />
                  </div>
                  <div className="w-32 flex-none overflow-hidden text-ellipsis">
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <div className="w-full ">
                    <Skeleton className="w-52 h-4" />
                  </div>
                  <div className="w-24 flex-none">
                    <Skeleton className="w-12 h-4" />
                  </div>
                  <div className="w-28 flex-none">
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <div className="w-32 flex-none flex gap-4 justify-center">
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full">
              {data?.migrates ? (
                <div className="w-full min-h-[200px]">
                  {data?.migrates.map((item: any, i: number) => (
                    <div
                      className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                      key={item.id}
                    >
                      <p className="w-10 text-center flex-none">{i + 1}</p>
                      <p className="w-32 flex-none overflow-hidden text-ellipsis">
                        {data?.code_document_migrate}
                      </p>
                      <p className="w-full whitespace-pre-wrap">
                        {item.product_color}
                      </p>
                      <p className="w-24 flex-none">
                        {item.product_total.toLocaleString()}
                      </p>
                      <p className="w-28 flex-none">
                        <Badge className="bg-gray-300 hover:bg-gray-300 text-black capitalize rounded">
                          {item.status_migrate}
                        </Badge>
                      </p>
                      <div className="w-32 flex-none flex gap-4 justify-center">
                        <Button
                          className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen(
                              "remove-product-create-migrate-modal",
                              item.id
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <div>Remove</div>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default Client;
