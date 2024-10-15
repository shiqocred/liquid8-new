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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowRightCircle,
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  FileDown,
  PackageOpen,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import Loading from "../loading";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

interface Category {
  id: string;
  new_barcode_product: string;
  new_name_product: string;
  new_category_product: string;
  new_price_product: string;
  new_status_product: "display";
  display_price: string;
  created_at: string;
  new_date_in_product: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1, //per page data
  });
  const [pageFiltered, setPageFiltered] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1, //per page data
  });

  // handle GET
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/staging_products?page=${page.current}&q=${searchValue}`,
        {
          headers: {
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
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetFiltered = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/staging/filter_product?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFiltered(response.data.data.resource.data.data);
      setPageFiltered({
        current: response.data.data.resource.data.current_page ?? 1,
        last: response.data.data.resource.data.last_page ?? 1,
        from: response.data.data.resource.data.from ?? 0,
        total: response.data.data.resource.data.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT:", err);
    }
  };

  const handleAddFilter = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/staging/filter_product/${id}/add`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("successfully added product staging list");
      cookies.set("updateStaggingProduct", "added");
    } catch (err: any) {
      toast.error(
        `Error ${err.response.status}: failed to add product staging list`
      );
      console.log("ERROR_FILTERED_PRODUCT:", err);
    }
  };
  const handleDeleteFilter = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${baseUrl}/staging/filter_product/destroy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("successfully deleted the product staging list");
      cookies.set("updateStaggingProduct", "deleted");
    } catch (err: any) {
      toast.error(
        `Error ${err.response.status}: failed to delete product staging list`
      );
      console.log("ERROR_FILTERED_PRODUCT:", err);
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
          url: "/stagging/product",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (cookies.get("updateStaggingProduct")) {
      fetchDocuments();
      handleGetFiltered();
      return cookies.remove("updateStaggingProduct");
    }
  }, [cookies.get("updateStaggingProduct")]);

  useEffect(() => {
    handleCurrentId(searchValue);
  }, [searchValue]);

  useEffect(() => {
    handleGetFiltered();
    fetchDocuments();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Stagging</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Product</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product Stagging</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <div className="flex items-center gap-3 w-2/5">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
              />
              <div className="h-9 px-4 flex-none flex items-center text-sm rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                Total:
                <span className="font-semibold">{page.total} Products</span>
              </div>
            </div>
            <div className="flex gap-3">
              <TooltipProviderPage value={"Export Data"}>
                <Button className="bg-sky-100 hover:bg-sky-200 border border-sky-500 text-black p-0 w-9">
                  <FileDown className="w-4 h-4" />
                </Button>
              </TooltipProviderPage>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                    Filtered Products
                    <ArrowRightCircle className="w-4 h-4 ml-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-w-[50vw]">
                  <SheetHeader>
                    <SheetTitle>List Product Stagging (Filtered)</SheetTitle>
                  </SheetHeader>
                  <div className="w-full flex flex-col gap-5 mt-5 text-sm">
                    <div className="flex gap-4 items-center w-full">
                      <div className="h-9 px-4 flex items-center rounded-md justify-center border gap-1 border-sky-500 bg-sky-100">
                        Total Filtered:
                        <span className="font-semibold">
                          {pageFiltered.total} Products
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          onOpen("done-check-all-stagging-product-modal")
                        }
                        className="bg-sky-400/80 hover:bg-sky-400 text-black"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Done Check All
                      </Button>
                    </div>
                    <div className="w-full p-4 rounded-md border border-sky-400/80">
                      <ScrollArea>
                        <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                          <p className="w-10 text-center flex-none">No</p>
                          <p className="w-32 flex-none">Barcode</p>
                          <p className="w-full min-w-44 max-w-[400px]">
                            Product Name
                          </p>
                          <p className="w-14 text-center flex-none">Action</p>
                        </div>

                        <ScrollArea className="h-[64vh]">
                          {filtered.map((item, i) => (
                            <div
                              className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                              key={item?.id}
                            >
                              <p className="w-10 text-center flex-none">
                                {page.from + i}
                              </p>
                              <p className="w-32 flex-none">
                                {item?.new_barcode_product ??
                                  item?.old_barcode_product ??
                                  ""}
                              </p>
                              <TooltipProviderPage
                                value={
                                  <p className="w-44">
                                    {item?.new_name_product}
                                  </p>
                                }
                              >
                                <p className="w-full min-w-44 max-w-[400px] whitespace-nowrap text-ellipsis overflow-hidden">
                                  {item?.new_name_product}
                                </p>
                              </TooltipProviderPage>
                              <div className="w-14 flex-none flex gap-4 justify-center">
                                <Button
                                  className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 p-0 w-9"
                                  variant={"outline"}
                                  type="button"
                                  onClick={(e) =>
                                    handleDeleteFilter(e, item.id)
                                  }
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                        Total: {pageFiltered.total}
                      </Badge>
                      <div className="flex gap-5 items-center">
                        <p className="text-sm">
                          Page {pageFiltered.current} of {pageFiltered.last}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                            onClick={() =>
                              setPageFiltered((prev) => ({
                                ...prev,
                                current: prev.current - 1,
                              }))
                            }
                            disabled={pageFiltered.current === 1}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                            onClick={() =>
                              setPageFiltered((prev) => ({
                                ...prev,
                                current: prev.current - 1,
                              }))
                            }
                            disabled={
                              pageFiltered.current === pageFiltered.last
                            }
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-32 flex-none">Barcode</p>
                <p className="w-full min-w-72 max-w-[500px]">Product Name</p>
                <p className="w-52 flex-none">Category</p>
                <p className="w-32 flex-none">Price</p>
                <p className="w-14 text-center flex-none">Action</p>
              </div>
              {data.map((item, i) => (
                <div
                  className="flex w-full px-5 py-2.5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={item.id}
                >
                  <p className="w-10 text-center flex-none">{page.from + i}</p>
                  <p className="w-32 flex-none">
                    {item?.new_barcode_product ??
                      item?.old_barcode_product ??
                      "-"}
                  </p>
                  <TooltipProviderPage
                    value={<p className="w-72">{item?.new_name_product}</p>}
                  >
                    <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap text-ellipsis overflow-hidden">
                      {item?.new_name_product}
                    </p>
                  </TooltipProviderPage>
                  <p className="w-52 flex-none">
                    {item?.new_category_product ?? item?.new_tag_product}
                  </p>
                  <p className="w-32 flex-none">
                    {formatRupiah(item?.new_price_product) ?? "Rp 0"}
                  </p>
                  <div className="w-14 flex-none flex gap-4 justify-center">
                    <TooltipProviderPage value="Add">
                      <Button
                        className="items-center w-9 px-0 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                        variant={"outline"}
                        type="button"
                        onClick={(e) => handleAddFilter(e, item.id)}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </TooltipProviderPage>
                  </div>
                </div>
              ))}
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
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
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
