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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Grid2x2X,
  Loader,
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
import { format } from "date-fns";
import { useModal } from "@/hooks/use-modal";
import { baseUrl } from "@/lib/baseUrl";

export const Client = () => {
  // core
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { onOpen } = useModal();

  // state boolean
  const [is404, setIs404] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // search
  const [dataSearch, setDataSearch] = useState(searchParams.get("q") ?? "");
  const searchValue = useDebounce(dataSearch);

  // data
  const [baseDocument, setBaseDocument] = useState("");
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
  const [data, setData] = useState({
    id: "0",
    old_barcode_product: "",
    old_name_product: "",
    old_quantity_product: "0",
    old_price_product: "0",
    created_at: "",
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
  const handleGetBarcode = async () => {
    setLoading(true);
    const codeDocument = `${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}`;
    try {
      const response = await axios.get(
        `${baseUrl}/search_barcode_product?code_document=${codeDocument}&old_barcode_product=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.data.status) {
        toast.success("Barcode successully found.");
        setData(response.data.data.resource.product);
        setDescription({
          abnormal: "",
          damaged: "",
        });
        if (response.data.data.resource.color_tags) {
          setTagColor(response.data.data.resource.color_tags[0]);
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
      } else {
        toast.error("Barcode failed to find.");
      }
    } catch (err: any) {
      toast.error("Something when wrong");
      console.log("ERROR_GET_BARCODE:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDocuments = async () => {
    const codeDocument = `${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}`;
    try {
      const response = await axios.get(
        `${baseUrl}/documents?q=${codeDocument}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.data.resource.data.length > 0) {
        setBaseDocument(response.data.data.resource.data[0].base_document);
      } else {
        setIs404(true);
      }
    } catch (err: any) {
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
    const codeDocument = `${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}`;
    const body = {
      code_document: codeDocument,
      old_barcode_product: data.old_barcode_product,
      new_barcode_product: "",
      new_name_product: data.old_name_product,
      old_name_product: data.old_name_product,
      new_quantity_product: data.old_quantity_product,
      new_price_product:
        parseFloat(data.old_price_product) < 100000
          ? tagColor.fixed_price_color
          : parseFloat(data.old_price_product) -
            (parseFloat(data.old_price_product) / 100) * selected.discount,
      old_price_product: data.old_price_product,
      new_date_in_product: format(new Date(data.created_at), "yyyy-MM-dd"),
      new_status_product: "display",
      condition: type,
      new_category_product: type === "lolos" ? selected.name : "",
      new_tag_product: tagColor?.name_color ?? "",
      deskripsi:
        type === "abnormal"
          ? description.abnormal
          : type === "damaged"
          ? description.damaged
          : "",
    };
    try {
      const response = await axios.post(`${baseUrl}/product-approves`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const dataResponse = response.data.data;
      if (dataResponse.needConfirmation) {
        toast.success(dataResponse.message);
        setTagColor({
          id: "0",
          hexa_code_color: "",
          name_color: "",
          fixed_price_color: "0",
        });
        setData({
          id: "0",
          old_barcode_product: "",
          old_name_product: "",
          old_quantity_product: "0",
          old_price_product: "0",
          created_at: "",
        });
        setDescription({
          abnormal: "",
          damaged: "",
        });
        setSelected({
          name: "",
          discount: 0,
        });
        setDataSearch("");
        if (searchRef.current) {
          searchRef.current.focus();
        }
        if (dataResponse.resource.new_category_product) {
          onOpen("manifest-inbound-barcode-printered", {
            barcode: dataResponse.resource.new_barcode_product,
            newPrice: dataResponse.resource.new_price_product,
            oldPrice: dataResponse.resource.old_price_product,
            category: dataResponse.resource.new_category_product,
          });
        }
      } else {
        toast.error(dataResponse.message);
        onOpen("double-barcode-manifet-inbound", body);
      }
    } catch (err: any) {
      toast.success("Product gagal terkirim");
      console.log("ERROR_STORE_NEW_PRODUCT:", err);
    }
  };

  // handle SearchParams
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
          url: `/inbound/check-product/manifest-inbound/${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}/check`,
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  // useEffect
  useEffect(() => {
    handleCurrentId(searchValue);
    if (searchValue.length > 0) {
      handleGetBarcode();
    } else {
      setTagColor({
        id: "0",
        hexa_code_color: "",
        name_color: "",
        fixed_price_color: "0",
      });
      setData({
        id: "0",
        old_barcode_product: "",
        old_name_product: "",
        old_quantity_product: "0",
        old_price_product: "0",
        created_at: "",
      });
    }
  }, [searchValue]);

  useEffect(() => {
    if (cookies.get("updatedBarcode")) {
      setTagColor({
        id: "0",
        hexa_code_color: "",
        name_color: "",
        fixed_price_color: "0",
      });
      setData({
        id: "0",
        old_barcode_product: "",
        old_name_product: "",
        old_quantity_product: "0",
        old_price_product: "0",
        created_at: "",
      });
      setDescription({
        abnormal: "",
        damaged: "",
      });
      setSelected({
        name: "",
        discount: 0,
      });
      setDataSearch("");
      if (searchRef.current) {
        searchRef.current.focus();
      }
      return cookies.remove("updatedBarcode");
    }
  }, [cookies.get("updatedBarcode")]);

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
            <BreadcrumbLink href="/inbound/check-product/manifest-inbound/">
              Manifest Inbound
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Check</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-6 rounded-md shadow bg-white w-full px-5 gap-4 items-center relative">
        <div className="w-full text-xs flex items-center">
          <Link
            href={`/inbound/check-product/manifest-inbound/${params.manifestInboundId}/${params.manifestInboundMonth}/${params.manifestInboundYear}/detail`}
            className="group"
          >
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
            <p>Data Name</p>
            <h3 className="text-black font-semibold text-xl">{baseDocument}</h3>
          </div>
        </div>
        <Separator orientation="vertical" className="h-16 bg-gray-500" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGetBarcode();
          }}
          className="w-full flex-col flex gap-1"
        >
          <Label className="text-xs">Search Barcode Product</Label>
          <div className="flex w-full">
            <div className="relative w-full flex items-center">
              <Input
                className="w-full border-sky-400/80 focus-visible:ring-sky-400 rounded-r-none text-black"
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
                placeholder="Search..."
                ref={searchRef}
                autoFocus
              />
              {dataSearch.length > 0 && (
                <button
                  className="absolute right-3"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setDataSearch("");
                    if (searchRef.current) {
                      searchRef.current.focus();
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="rounded-l-none flex-none p-0 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
      {loading ? (
        <div className="flex w-full bg-white rounded-md shadow items-center justify-center h-[300px]">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : data.id === "0" ? (
        <div className="flex w-full bg-white rounded-md shadow items-center justify-center h-[300px]">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Grid2x2X className="w-8 h-8" />
            <p className="text-sm font-semibold">No Data Viewed.</p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center">
            <div className="w-full flex gap-2 items-center">
              <p>Keterangan:</p>
              <Badge className="bg-sky-100 hover:bg-sky-100 border border-sky-500 text-black py-1 gap-1 rounded-full shadow-none">
                {parseFloat(data.old_price_product) > 100000 ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                <p>100K</p>
              </Badge>
            </div>
            <div className="w-full flex justify-end">
              <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Done Check All
              </Button>
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
                <h2 className="text-xl font-bold">Old Data</h2>
                <div className="flex w-full items-center gap-4 flex-col">
                  <div className="w-full flex gap-4">
                    <div className="flex flex-col w-full gap-1">
                      <Label>Barcode</Label>
                      <Input
                        value={data.old_barcode_product}
                        disabled
                        className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <Label>Name</Label>
                      <Input
                        value={data.old_name_product}
                        disabled
                        className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                      />
                    </div>
                  </div>
                  <div className="flex w-full gap-4">
                    <div className="flex flex-col w-full gap-1">
                      <Label>Price</Label>
                      <Input
                        value={formatRupiah(parseFloat(data.old_price_product))}
                        disabled
                        className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <Label>Qty</Label>
                      <Input
                        value={parseFloat(
                          data.old_quantity_product
                        ).toLocaleString()}
                        disabled
                        className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {parseFloat(data?.old_price_product) > 100000 ? (
              <div className="w-full">
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
                  <h2 className="text-xl font-bold">New Data</h2>
                  <div className="flex w-full items-center gap-4 flex-col">
                    <div className="flex flex-col w-full gap-1">
                      <Label>Name</Label>
                      <Input
                        value={data.old_name_product}
                        disabled
                        className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                      />
                    </div>
                    <div className="w-full flex gap-4">
                      <div className="flex flex-col w-full gap-1">
                        <Label>Price</Label>
                        <Input
                          value={formatRupiah(
                            parseFloat(data.old_price_product) -
                              (parseFloat(data.old_price_product) / 100) *
                                selected.discount
                          )}
                          disabled
                          className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-1">
                        <Label>Qty</Label>
                        <Input
                          value={parseFloat(
                            data.old_quantity_product
                          ).toLocaleString()}
                          disabled
                          className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
                  <h2 className="text-xl font-bold">New Data</h2>
                  <div className="flex w-full items-center gap-4 flex-col">
                    <div className="flex flex-col w-full gap-1">
                      <Label>Tag Color</Label>
                      <div className="flex w-full gap-2 items-center border rounded-md border-sky-500 px-5 h-9 cursor-default">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: tagColor?.hexa_code_color }}
                        />
                        <p className="text-sm">{tagColor.name_color}</p>
                      </div>
                    </div>
                    <div className="w-full flex gap-4">
                      <div className="flex flex-col w-full gap-1">
                        <Label>Price</Label>
                        <Input
                          value={formatRupiah(
                            parseFloat(tagColor.fixed_price_color)
                          )}
                          disabled
                          className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-1">
                        <Label>Qty</Label>
                        <Input
                          value={parseFloat(
                            data.old_quantity_product
                          ).toLocaleString()}
                          disabled
                          className="w-full border-sky-400/80 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                  {parseFloat(data.old_price_product) >= 100000 && (
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
                      !selected.name &&
                      parseFloat(data.old_price_product) > 100000
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
                    disabled={!description.damaged}
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
                    disabled={!description.abnormal}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};
