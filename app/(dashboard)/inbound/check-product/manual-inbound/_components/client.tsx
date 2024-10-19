"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useModal } from "@/hooks/use-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, formatRupiah } from "@/lib/utils";

import axios from "axios";
import { toast } from "sonner";
import { Loader, Send } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { FormEvent, useEffect, useRef, useState } from "react";

import Loading from "../loading";
import { baseUrl } from "@/lib/baseUrl";

export const Client = () => {
  // state boolean
  const [isMounted, setIsMounted] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // core
  const { onOpen } = useModal();
  const nameRef = useRef<HTMLInputElement | null>(null);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [input, setInput] = useState({
    name: "",
    price: "0",
    qty: "1",
    discountPrice: "0",
    category: "",
    discount: 0,
    hexa_code_color: "",
    name_color: "",
    fixed_price_color: "0",
    damaged: "",
    abnormal: "",
  });
  const [categories, setCategories] = useState([
    {
      id: "0",
      name_category: "",
      discount_category: "0",
      max_price_category: "0",
    },
  ]);

  // debounce
  const inputValue = useDebounce(input.price);

  // handle GET
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
      console.log(response);
      const dataRes = response.data.data.resource;
      if (!dataRes.category) {
        setInput((prev) => ({
          ...prev,
          fixed_price_color: dataRes.warna.fixed_price_color,
          hexa_code_color: dataRes.warna.hexa_code_color,
          name_color: dataRes.warna.name_color,
        }));
        setCategories([
          {
            id: "0",
            name_category: "",
            discount_category: "0",
            max_price_category: "0",
          },
        ]);
      } else if (!dataRes.warna) {
        setCategories(dataRes.category);
        setInput((prev) => ({
          ...prev,
          fixed_price_color: "0",
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

  // handle Submit
  const handleSubmit = async (
    e: FormEvent,
    type: "lolos" | "abnormal" | "damaged"
  ) => {
    e.preventDefault();
    const body = {
      new_name_product: input.name,
      new_quantity_product: input.qty,
      old_price_product: input.price,
      new_status_product: "display",
      new_category_product: type === "lolos" ? input.category ?? "" : "",
      new_price_product: input.discountPrice,
      new_tag_product: input.name_color ?? "",
      condition: type,
      description:
        type === "abnormal"
          ? input.abnormal
          : type === "damaged"
          ? input.damaged
          : "",
    };
    try {
      const response = await axios.post(`${baseUrl}/add_product`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const dataResponse = response.data.data;
      if (dataResponse.resource.new_category_product) {
        onOpen("manual-inbound-barcode-printered", {
          barcode: dataResponse.resource.new_barcode_product,
          newPrice: dataResponse.resource.new_price_product,
          oldPrice: dataResponse.resource.old_price_product,
          category: dataResponse.resource.new_category_product,
        });
      }
      if (nameRef.current) {
        nameRef.current.focus();
      }
      setInput({
        name: "",
        price: "0",
        qty: "1",
        discountPrice: "0",
        category: "",
        discount: 0,
        hexa_code_color: "",
        name_color: "",
        fixed_price_color: "0",
        damaged: "",
        abnormal: "",
      });
      setCategories([
        {
          id: "0",
          name_category: "",
          discount_category: "0",
          max_price_category: "0",
        },
      ]);
    } catch (err: any) {
      toast.success("Product gagal terkirim");
      console.log("ERROR_STORE_NEW_PRODUCT:", err);
    }
  };

  // effect change default value
  useEffect(() => {
    if (isNaN(parseFloat(input.qty)) || parseFloat(input.qty) <= 0) {
      setInput((prev) => ({ ...prev, qty: "1" }));
    }
    if (isNaN(parseFloat(input.price))) {
      setInput((prev) => ({ ...prev, price: "0" }));
    }
    if (isNaN(parseFloat(input.discountPrice))) {
      setInput((prev) => ({ ...prev, discountPrice: "0" }));
    }
  }, [input]);

  // effect count discount
  useEffect(() => {
    if (parseFloat(input.price) < 100000) {
      setInput((prev) => ({
        ...prev,
        discountPrice: Math.round(
          parseFloat(input.fixed_price_color)
        ).toString(),
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        discountPrice: (
          Math.round(parseFloat(input.price)) -
          (Math.round(parseFloat(input.price)) / 100) * input.discount
        ).toString(),
      }));
    }
  }, [input.price, input.fixed_price_color, input.discount]);

  // effect GET price
  useEffect(() => {
    handleGetPrice();
  }, [inputValue]);

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
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Data Check</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Manual Inbound</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full gap-4">
        <div className="w-3/4">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">Add New Data</h2>
            <div className="flex w-full items-center gap-4 flex-col">
              <div className="flex flex-col w-full gap-1">
                <Label>Product Name</Label>
                <Input
                  value={input.name}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                  autoFocus
                  ref={nameRef}
                />
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-full gap-1">
                  <Label>Price</Label>
                  <Input
                    value={input.price}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        price:
                          e.target.value.length > 1 &&
                          e.target.value.startsWith("0")
                            ? e.target.value.replace(/^0+/, "")
                            : e.target.value,
                      }))
                    }
                    type="number"
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Label>Qty</Label>
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
                    type="number"
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">Price After Discount</h2>
            <div className="flex w-full items-center gap-4 flex-col mt-4">
              <Input
                value={input.discountPrice}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    discountPrice:
                      e.target.value.length > 1 &&
                      e.target.value.startsWith("0")
                        ? e.target.value.replace(/^0+/, "")
                        : e.target.value,
                  }))
                }
                type="number"
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
              />
            </div>
            <p className="flex w-full items-center justify-center mt-4 mb-2 font-semibold">
              {formatRupiah(parseFloat(input.discountPrice)) ?? "Rp. 0"}
            </p>
          </div>
        </div>
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
              {loadingPrice ? (
                <div className="flex w-full bg-white rounded-md shadow items-center justify-center h-[200px]">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="w-full">
                  {parseFloat(input.price) >= 100000 &&
                    categories.length !== 1 && (
                      <div className="w-full flex flex-col gap-3">
                        <RadioGroup
                          onValueChange={(e) => {
                            const selectedCategory = categories.find(
                              (item) => item.name_category === e
                            );
                            setInput((prev) => ({
                              ...prev,
                              category: selectedCategory?.name_category ?? "",
                              discount: parseFloat(
                                selectedCategory?.discount_category ?? "0"
                              ),
                            }));
                          }}
                          className="grid grid-cols-4 w-full gap-6"
                        >
                          {categories.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center gap-4 w-full border px-4 py-2.5 rounded-md",
                                input.category === item.name_category
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
                                    input.category === item.name_category
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
                    )}{" "}
                  {parseFloat(input.price) < 100000 && input.name_color && (
                    <div className="flex p-3 rounded-md justify-between border border-gray-500 items-center">
                      <div className="flex gap-2 items-center">
                        <div
                          className="w-4 h-4 rounded-full shadow"
                          style={{ background: input.hexa_code_color }}
                        />
                        <p className="text-sm font-semibold">
                          {input.name_color}
                        </p>
                      </div>
                      <Badge className="bg-gray-200 hover:bg-gray-200 border-gray-500 text-gray-700 rounded-full">
                        {input.hexa_code_color}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={
                  (!input.category && parseFloat(input.price) > 100000) ||
                  !input.name ||
                  parseFloat(input.price) === 0 ||
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
                value={input.damaged}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, damaged: e.target.value }))
                }
              />
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={
                  !input.damaged ||
                  !input.name ||
                  parseFloat(input.price) === 0 ||
                  parseFloat(input.qty) === 0
                }
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
                value={input.abnormal}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, abnormal: e.target.value }))
                }
              />
              <Button
                type="submit"
                className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                disabled={
                  !input.abnormal ||
                  !input.name ||
                  parseFloat(input.price) === 0 ||
                  parseFloat(input.qty) === 0
                }
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
