"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { CalendarX, Percent, ScanBarcode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";

export const DetailPromoModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "detail-promo-modal";

  const [input, setInput] = useState({
    name: "",
    discount: "0",
    price: 0,
  });

  const handleClose = () => {
    setInput({
      name: "",
      discount: "0",
      price: 0,
    });
    onClose();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      discount_promo: input.discount,
      name_promo: input.name,
      price_promo:
        input.price - (input.price / 100) * parseFloat(input.discount),
    };
    try {
      await axios.put(`${baseUrl}/promo/${data.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Promo successfully updated");
      cookies.set("listProductMV", "created");
      handleClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Promo failed to update");
      console.log("ERROR_UPDATE_PROMO:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.discount))) {
      setInput((prev) => ({ ...prev, discount: "0" }));
    }
  }, [input]);

  useEffect(() => {
    if (isModalOpen) {
      setInput({
        name: data?.name_promo,
        discount: Math.round(data?.discount_promo).toString(),
        price: Math.round(data?.new_product?.new_price_product),
      });
    }
  }, [isModalOpen, data]);

  return (
    <Modal
      title="Detail Promo"
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-xl"
    >
      <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
        <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-3">
          <ScanBarcode className="w-5 h-5 mr-2" />
          <div className="w-full flex justify-between items-center">
            Product Barcode:
            <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
              {data?.new_product?.new_barcode_product}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3 flex-col my-4">
          <div className="flex flex-col w-full overflow-hidden gap-0.5">
            <p className="text-sm font-medium">Name Product</p>
            <p className="text-sm w-full whitespace-pre-wrap min-h-9 py-2 leading-relaxed flex items-center px-3 border-b border-sky-400/80 text-gray-600">
              {data?.new_product?.new_name_product}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-1/3 overflow-hidden gap-0.5">
              <p className="text-sm font-medium">Qty</p>
              <p className="text-sm w-full whitespace-pre-wrap min-h-9 flex items-center px-3 border-b border-sky-400/80 text-gray-600">
                {parseFloat(
                  data?.new_product?.new_quantity_product ?? "0"
                ).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col w-2/3 overflow-hidden gap-0.5">
              <p className="text-sm font-medium">Price</p>
              <p className="text-sm w-full whitespace-pre-wrap min-h-9 flex items-center px-3 border-b border-sky-400/80 text-gray-600">
                {formatRupiah(
                  parseFloat(data?.new_product?.old_price_product ?? "0")
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="w-full flex flex-col gap-3">
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
          <div className="w-full flex gap-3">
            <div className="flex flex-col gap-1 w-1/3 relative">
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
            <div className="flex flex-col gap-1 w-2/3 relative">
              <Label>Price After Promo</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                value={formatRupiah(
                  input.price - (input.price / 100) * parseFloat(input.discount)
                )}
                disabled
              />
            </div>
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
            className="text-black w-full bg-sky-400 hover:bg-sky-400/80"
            type="submit"
            disabled={!input.name}
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
