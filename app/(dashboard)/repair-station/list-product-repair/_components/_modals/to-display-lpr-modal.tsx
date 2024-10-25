"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ScanBarcode } from "lucide-react";
import axios from "axios";
import { cn, formatRupiah } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

const categoryVariant = {
  isClose: { width: "0px", padding: "0px", marginLeft: "0px" },
  isOpen: { width: "300px", padding: "20px", marginLeft: "8px" },
};

export const ToDisplayLPRModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const handleClose = () => {
    onClose();
    setIsOpenCategory(false);
  };

  const router = useRouter();

  const findNotNull = (v: any) => {
    if (v) {
      const qualityObject = JSON.parse(v);

      const filteredEntries = Object.entries(qualityObject).find(
        ([key, value]) => value !== null
      );

      return filteredEntries?.[0] ?? "";
    }
  };

  const [categories, setCategories] = useState([
    {
      id: "0",
      name_category: "",
      discount_category: "0",
      max_price_category: "0",
    },
  ]);

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    price: "0",
    qty: "1",
    category: "",
    fixed_price_color: "",
    name_color: "",
    hexa_code_color: "",
  });

  const isModalOpen = isOpen && type === "to-display-lpr-modal";

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      old_barcode_product: data?.old_barcode_product,
      old_price_product: data?.old_price_product,
      new_status_product: data?.new_status_product,
      new_barcode_product: data?.new_barcode_product,
      new_name_product: input.name,
      new_price_product: input.price,
      new_quantity_product: input.qty,
      new_category_product: input.category ?? null,
    };
    try {
      const res = await axios.put(
        `${baseUrl}/repair/update/${data?.id}`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully repaired");
      cookies.set("LPRPage", "added");
      handleClose();
      if (res.data.data.resource.new_category_product) {
        onOpen("barcode-printered-lpr-modal", {
          barcode: res.data.data.resource.new_barcode_product,
          newPrice: res.data.data.resource.new_price_product,
          oldPrice: res.data.data.resource.old_price_product,
          category: res.data.data.resource.new_category_product,
          cancel: "/repair-station/list-product-repair",
        });
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  // handle GET
  const handleGetPrice = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/get-latestPrice?old_price_product=${data?.old_price_product}`,
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
          fixed_price_color: dataRes.warna.fixed_price_color,
          hexa_code_color: dataRes.warna.hexa_code_color,
          name_color: dataRes.warna.name_color,
          price: dataRes.warna.fixed_price_color,
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
    }
  };

  useEffect(() => {
    if (isModalOpen && data) {
      setInput({
        name: data?.new_name_product ?? "",
        price: data?.new_price_product ?? "0",
        qty: data?.new_quantity_product ?? "1",
        category: data?.new_category_product ?? "",
        fixed_price_color: "",
        name_color: "",
        hexa_code_color: "",
      });
      if (data?.new_category_product) {
        setIsOpenCategory(true);
      } else {
        setIsOpenCategory(false);
      }
      handleGetPrice();
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title=""
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className={cn(
        "bg-transparent border-none shadow-none rounded-none p-0 flex gap-0",
        data?.old_price_product < 100000 ? "max-w-2xl" : "max-w-4xl"
      )}
    >
      <div className="w-full flex gap-4 bg-white rounded-md p-5 flex-col">
        <h3 className="font-bold text-xl">To Display Product</h3>
        <form
          onSubmit={handleConfirm}
          className="w-full relative overflow-hidden flex flex-col gap-4"
        >
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
              <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-2">
                <ScanBarcode className="w-4 h-4 mr-2" />
                <div className="flex w-full items-center justify-between">
                  <p>Old Data</p>
                  <div className="flex gap-3">
                    <Badge
                      className={cn(
                        "border rounded-full capitalize",
                        findNotNull(data?.new_quality) === "damaged" &&
                          "bg-red-200 hover:bg-red-200 border-red-700 text-red-700",
                        findNotNull(data?.new_quality) === "abnormal" &&
                          "bg-orange-200 hover:bg-orange-200 border-orange-700 text-orange-700"
                      )}
                    >
                      {"From " + findNotNull(data?.new_quality)}
                    </Badge>
                    <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
                      {data?.old_barcode_product}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col pl-6 w-full overflow-hidden gap-1">
                  <p className="text-xs font-medium">Name Product</p>
                  <TooltipProviderPage
                    value={
                      <p className="w-full max-w-72">
                        {data?.new_name_product}
                      </p>
                    }
                  >
                    <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {data?.new_name_product}
                    </p>
                  </TooltipProviderPage>
                </div>
                <div className="w-1/3 flex-none pl-6 flex gap-2 ">
                  <div className="flex flex-col w-2/3 overflow-hidden gap-1">
                    <p className="text-xs font-medium">Price</p>
                    <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatRupiah(parseFloat(data?.old_price_product ?? "0"))}
                    </p>
                  </div>
                  <div className="flex flex-col w-1/3 overflow-hidden gap-1">
                    <p className="text-xs font-medium">Qty</p>
                    <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {parseFloat(
                        data?.new_quantity_product ?? "0"
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
              <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-2">
                <ScanBarcode className="w-4 h-4 mr-2" />
                <div className="flex w-full items-center justify-between">
                  <p>New Data</p>
                  <div className="flex gap-4">
                    <Badge className="border rounded-full bg-green-200 hover:bg-green-200 border-green-700 text-green-700">
                      To Good
                    </Badge>
                    <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
                      {data?.new_barcode_product}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col pl-6 w-full  gap-1">
                  <Label htmlFor="nameNew" className="text-xs font-medium">
                    Name Product
                  </Label>
                  <Input
                    id="nameNew"
                    className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                    value={input.name}
                    onChange={(e) =>
                      setInput((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Custom Barcode..."
                  />
                </div>
                <div className="w-full flex-none pl-6 flex gap-2 ">
                  <div className="flex flex-col w-full  gap-1">
                    <Label htmlFor="priceNew" className="text-xs font-medium">
                      Price
                    </Label>
                    <Input
                      id="priceNew"
                      className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                      value={Math.round(parseFloat(input.price))}
                      onChange={(e) =>
                        setInput((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="Custom Barcode..."
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Label className="text-xs font-medium">Qty</Label>
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
                          type="button"
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
                          type="button"
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
                {data?.old_price_product >= 100000 ? (
                  <div className="flex flex-col gap-1 pl-6">
                    <Label className="text-xs font-medium">Category</Label>
                    <Button
                      type="button"
                      onClick={() => setIsOpenCategory(!isOpenCategory)}
                      className="justify-between border-sky-400/80 focus:ring-sky-400 focus:ring-1 hover:bg-sky-50 focus:bg-sky-50"
                      variant={"outline"}
                    >
                      <p>
                        {!!input.category ? input.category : "No Category yet."}
                      </p>
                      <p className="text-xs italic font-light underline text-gray-600">
                        change &gt;&gt;
                      </p>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 pl-6">
                    <Label className="text-xs font-medium">Color</Label>
                    <div className="px-4 h-9 rounded border-sky-400/80 border flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border-gray-500"
                          style={{
                            background: input.hexa_code_color ?? "black",
                          }}
                        />
                        <p>{input.name_color}</p>
                      </div>
                      <p className="text-xs font-semibold">
                        {formatRupiah(
                          Math.round(parseFloat(input.fixed_price_color))
                        ) ?? "Rp 0"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center w-full">
            <Button
              className="w-1/3 flex-none bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !input.name ||
                parseFloat(input.qty) === 0 ||
                (data?.old_price_product >= 100000 && !input.category)
              }
              className="w-2/3 flex-none bg-sky-400/80 hover:bg-sky-400 text-black"
              type="submit"
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
      <motion.div
        initial="isClose"
        animate={isOpenCategory ? "isOpen" : "isClose"}
        variants={categoryVariant}
        className=" bg-white rounded-md flex flex-col gap-4 flex-none"
      >
        <h3
          className={cn(
            "font-bold text-xl",
            isOpenCategory ? "flex" : "hidden"
          )}
        >
          Select Category
        </h3>
        <ScrollArea
          className={cn(
            "h-[410px] w-full border border-sky-500 p-2 rounded-md",
            isOpenCategory ? "flex" : "hidden"
          )}
        >
          <RadioGroup
            onValueChange={(e) => {
              const selectedCategory = categories.find(
                (item) => item.name_category === e
              );
              setInput((prev) => ({
                ...prev,
                category: selectedCategory?.name_category ?? "",
                price: (
                  data?.old_price_product -
                  (data?.old_price_product / 100) *
                    parseFloat(selectedCategory?.discount_category ?? "0")
                ).toString(),
              }));
            }}
            className="flex flex-col w-[calc(100%-8px)] gap-4"
          >
            {categories?.map((item) => (
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
                      "font-bold border-b pb-1.5 whitespace-nowrap text-ellipsis overflow-hidden w-full",
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
                      Max. {formatRupiah(parseFloat(item.max_price_category))}
                    </span>
                  </p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </motion.div>
    </Modal>
  );
};
