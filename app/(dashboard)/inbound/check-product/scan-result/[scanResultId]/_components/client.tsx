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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  Loader,
  Minus,
  Plus,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatRupiah } from "@/lib/utils";
import Loading from "../loading";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import NotFound from "@/app/not-found";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { format } from "date-fns";
import { baseUrl } from "@/lib/baseUrl";

export const Client = () => {
  // core
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  // state boolean
  const [is404, setIs404] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // data
  const [data, setData] = useState<any>();
  const [input, setInput] = useState({
    price: "0",
    qty: "0",
  });
  const [description, setDescription] = useState({
    abnormal: "",
    damaged: "",
  });
  const [selected, setSelected] = useState({
    name: "",
    discount: 0,
  });
  const [tagColor, setTagColor] = useState({
    id: "0",
    hexa_code_color: "",
    name_color: "",
    fixed_price_color: "0",
  });
  const [categories, setCategories] = useState([
    {
      id: "0",
      name_category: "",
      discount_category: "0",
      max_price_category: "0",
    },
  ]);

  // handle GET
  const handleGetDocuments = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/product_scan_search?id=${params.scanResultId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource.product);
      setInput((prev) => ({
        ...prev,
        price: response.data.data.resource.product.product_price,
        qty: "0",
      }));
      if (
        parseFloat(response.data.data.resource.product.product_price) < 100000
      ) {
        setTagColor(response.data.data.resource.color_tags);
        setSelected({
          name: "",
          discount: 0,
        });
      } else {
        setTagColor({
          id: "0",
          hexa_code_color: "",
          name_color: "",
          fixed_price_color: "0",
        });
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setIs404(true);
      }
      console.log("ERROR_GET_DOCUMENTS:", err);
    }
  };
  const handleGetCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(response.data.data.resource);
    } catch (err: any) {
      console.log("ERROR_GET_CATEGORIES:", err);
    }
  };

  // handle submit
  const handleSubmit = async (
    e: FormEvent,
    type: "lolos" | "abnormal" | "damaged"
  ) => {
    e.preventDefault();
    const body = {
      code_document: null,
      old_barcode_product: data?.old_barcode_product,
      new_barcode_product: data?.old_barcode_product, // Kirim barcode yang sesuai
      new_name_product: data?.product_name,
      old_name_product: data?.product_name,
      new_quantity_product: input.qty,
      new_price_product:
        parseFloat(data?.product_price) -
        (parseFloat(data?.product_price) / 100) * selected.discount,
      old_price_product: data?.product_price,
      new_date_in_product: format(new Date(data?.created_at), "yyyy-MM-dd"),
      new_status_product: "display",
      condition: type,
      new_category_product: type === "lolos" ? selected.name : "",
      new_tag_product: tagColor?.name_color ?? "",
      description:
        type === "abnormal"
          ? description.abnormal
          : type === "damaged"
          ? description.damaged
          : "",
    };
    try {
      const response = await axios.post(`${baseUrl}/move_to_staging`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const dataResponse = response.data.data;
      toast.success(dataResponse.message);
      if (dataResponse.resource.new_category_product) {
        onOpen("barcode-printered-check-product-scan-result", {
          barcode: dataResponse.resource.new_barcode_product,
          newPrice: dataResponse.resource.new_price_product,
          oldPrice: dataResponse.resource.old_price_product,
          category: dataResponse.resource.new_category_product,
          cancel: "/inbound/check-product/scan-result",
        });
      } else {
        router.push("/inbound/check-product/scan-result");
      }
    } catch (err: any) {
      toast.success("Product gagal terkirim");
      console.log("ERROR_STORE_NEW_PRODUCT:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.qty))) {
      setInput((prev) => ({ ...prev, qty: "0" }));
    }
  }, [input]);

  useEffect(() => {
    setIsMounted(true);
    handleGetDocuments();
    handleGetCategories();
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
            <BreadcrumbLink href="/inbound/check-product/scan-result">
              Scan Result
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Check</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-6 rounded-md shadow bg-white w-full px-5 gap-4 items-center relative">
        <div className="w-full text-xs flex items-center">
          <Link href={`/inbound/check-product/scan-result`} className="group">
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
            <p>Product Name</p>
            <h3 className="text-black font-semibold text-xl">
              {data?.product_name}
            </h3>
          </div>
        </div>
        <div className="w-full flex items-center text-xs">
          <div className="w-1/3 text-end mr-3 pr-3 border-r border-gray-500">
            <p>Barcode</p>
            <h3 className="text-black font-medium text-sm">
              {data?.old_barcode_product}
            </h3>
          </div>
          <div className="w-1/3 text-end mr-3 pr-3 border-r border-gray-500">
            <p>Old Price</p>
            <h3 className="text-black font-medium text-sm">
              {formatRupiah(parseFloat(data?.product_price))}
            </h3>
          </div>
          <div className="w-1/3 text-end">
            <p>Keterangan</p>
            <Badge className="bg-sky-100 hover:bg-sky-100 border border-sky-500 text-black py-0.5 gap-1 rounded-full shadow-none mt-1">
              {parseFloat(data?.product_price) > 100000 ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              <p>100K</p>
            </Badge>
          </div>
        </div>
      </div>
      {parseFloat(data?.product_price) > 100000 ? (
        <div className="w-full">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">New Data</h2>
            <div className="flex w-full items-center gap-4">
              <TooltipProviderPage value="Not Editable">
                <div className="flex flex-col w-1/2 flex-none gap-1">
                  <Label>Name</Label>
                  <Input
                    value={data?.product_name}
                    disabled
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                  />
                </div>
              </TooltipProviderPage>
              <TooltipProviderPage value="Not Editable">
                <div className="flex flex-col w-full gap-1">
                  <Label>Price</Label>
                  <Input
                    value={formatRupiah(
                      parseFloat(data?.product_price) -
                        (parseFloat(data?.product_price) / 100) *
                          selected.discount
                    )}
                    disabled
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                  />
                </div>
              </TooltipProviderPage>
              <div className="flex flex-col w-full gap-1">
                <Label>Qty</Label>
                <div className="relative flex items-center">
                  <Input
                    value={input.qty}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        qty:
                          e.target.value.length > 1 &&
                          e.target.value.startsWith("0")
                            ? e.target.value.replace(/^0+/, "")
                            : e.target.value,
                      }))
                    }
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                  />
                  <div className="flex absolute right-2 gap-1">
                    <button
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          qty: (parseFloat(prev.qty) - 1).toString(),
                        }))
                      }
                      disabled={parseFloat(input.qty) === 0}
                      className="w-6 h-6 flex items-center justify-center rounded bg-sky-100 hover:bg-sky-200 disabled:hover:bg-sky-100 disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          qty: (parseFloat(prev.qty) + 1).toString(),
                        }))
                      }
                      className="w-6 h-6 flex items-center justify-center rounded bg-sky-100 hover:bg-sky-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">New Data</h2>
            <div className="flex w-full items-center gap-4">
              <TooltipProviderPage value="Not Editable">
                <div className="flex flex-col w-1/2 flex-none gap-1">
                  <Label>Tag Color</Label>
                  <div className="flex w-full gap-2 items-center border rounded-md border-sky-500 px-5 h-9 cursor-default">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: tagColor?.hexa_code_color }}
                    />
                    <p className="text-sm">{tagColor.name_color}</p>
                  </div>
                </div>
              </TooltipProviderPage>
              <TooltipProviderPage value="Not Editable">
                <div className="flex flex-col w-full gap-1">
                  <Label>Price</Label>
                  <Input
                    value={formatRupiah(parseFloat(tagColor.fixed_price_color))}
                    disabled
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                  />
                </div>
              </TooltipProviderPage>
              <div className="flex flex-col w-full gap-1">
                <Label>Qty</Label>
                <div className="relative flex items-center">
                  <Input
                    value={input.qty}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        qty:
                          e.target.value.length > 1 &&
                          e.target.value.startsWith("0")
                            ? e.target.value.replace(/^0+/, "")
                            : e.target.value,
                      }))
                    }
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                  />
                  <div className="flex absolute right-2 gap-1">
                    <button
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          qty: (parseFloat(prev.qty) - 1).toString(),
                        }))
                      }
                      disabled={parseFloat(input.qty) === 0}
                      className="w-6 h-6 flex items-center justify-center rounded bg-sky-100 hover:bg-sky-200 disabled:hover:bg-sky-100 disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          qty: (parseFloat(prev.qty) + 1).toString(),
                        }))
                      }
                      className="w-6 h-6 flex items-center justify-center rounded bg-sky-100 hover:bg-sky-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center">
        <Tabs defaultValue="good" className="w-full">
          <div className="w-full flex justify-center">
            <TabsList className="bg-sky-100">
              <TabsTrigger className="w-32" value="good">
                Good
              </TabsTrigger>
              <TabsTrigger className="w-32" value="damaged">
                Damaged
              </TabsTrigger>
              <TabsTrigger className="w-32" value="abnormal">
                Abnormal
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="good">
            <form
              onSubmit={(e) => handleSubmit(e, "lolos")}
              className="w-full space-y-6 mt-6"
            >
              {parseFloat(data?.product_price) >= 100000 && (
                <div className="w-full flex flex-col gap-3">
                  <RadioGroup
                    onValueChange={(e) => {
                      const selectedCategory = categories.find(
                        (item) => item.name_category === e
                      );
                      setSelected({
                        name: selectedCategory?.name_category ?? "",
                        discount: parseFloat(
                          selectedCategory?.discount_category ?? "0"
                        ),
                      });
                    }}
                    className="grid grid-cols-4 w-full gap-6"
                  >
                    {categories.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center gap-4 w-full border px-4 py-2.5 rounded-md",
                          selected.name === item.name_category
                            ? "border-gray-500 bg-sky-100"
                            : "border-gray-300"
                        )}
                      >
                        <RadioGroupItem
                          value={item.name_category}
                          id={item.id}
                          className="flex-none"
                        />
                        <Label
                          htmlFor={item.id}
                          className="flex flex-col gap-1.5 w-full"
                        >
                          <p
                            className={cn(
                              "font-bold border-b pb-1.5",
                              selected.name === item.name_category
                                ? "border-gray-500"
                                : "border-gray-300"
                            )}
                          >
                            {item.name_category}
                          </p>
                          <p className="text-xs font-light flex items-center gap-1">
                            <span>{item.discount_category}%</span>
                            <span>-</span>
                            <span>
                              Max.{" "}
                              {formatRupiah(
                                parseFloat(item.max_price_category)
                              )}
                            </span>
                          </p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={
                  (!selected.name &&
                    parseFloat(data?.product_price) > 100000) ||
                  parseFloat(input.qty) === 0
                }
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="damaged">
            <form
              onSubmit={(e) => handleSubmit(e, "damaged")}
              className="w-full space-y-6 mt-6"
            >
              <Label>Description:</Label>
              <Textarea
                rows={6}
                className="border-sky-400/80 focus-visible:ring-sky-400"
                value={description.damaged}
                onChange={(e) =>
                  setDescription((prev) => ({
                    ...prev,
                    damaged: e.target.value,
                  }))
                }
              />
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={!description.damaged || parseFloat(input.qty) === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="abnormal">
            <form
              onSubmit={(e) => handleSubmit(e, "abnormal")}
              className="w-full space-y-6 mt-6"
            >
              <Label>Description:</Label>
              <Textarea
                rows={6}
                className="border-sky-400/80 focus-visible:ring-sky-400"
                value={description.abnormal}
                onChange={(e) =>
                  setDescription((prev) => ({
                    ...prev,
                    abnormal: e.target.value,
                  }))
                }
              />
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={!description.abnormal || parseFloat(input.qty) === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
