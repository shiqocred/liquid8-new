"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Percent } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export const GaborProductSaleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const [input, setInput] = useState("0");

  const isModalOpen = isOpen && type === "gabor-product-sale-modal";

  const handleClose = () => {
    onClose();
    setInput("0");
  };

  const handleGabor = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/sales/${data?.id}`,
        { product_price_sale: input },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Gabor successfully aplied");
      cookies.set("updateDataProduct", "moved");
      cookies.set("detailSale", "moved");
      handleClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Gabor failed to apply");
      console.log("ERROR_APPLY_GABOR:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input))) {
      setInput("0");
    }
  }, [input]);

  return (
    <Modal
      title="Gabor Price Product Sale"
      description="Apply discount to product sale price"
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-sm"
    >
      <form onSubmit={handleGabor} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1 w-full relative">
          <Label>Gabor Price</Label>
          <Input
            className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
            placeholder="0"
            value={input}
            // disabled={loadingSubmit}
            onChange={(e) =>
              setInput(
                e.target.value.startsWith("0")
                  ? e.target.value.replace(/^0+/, "")
                  : e.target.value
              )
            }
          />
          <Percent className="w-4 h-4 absolute right-3 bottom-2" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <Label>Price After Gabor</Label>
          <div className="text-sm font-bold border border-sky-500 rounded-md flex px-5 items-center justify-center h-9">
            {formatRupiah(
              parseFloat(data?.price) -
                parseFloat(input) * (parseFloat(data?.price) / 100)
            ) ?? "Rp 0"}
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
            className="bg-sky-400 hover:bg-sky-400/80 text-black w-full"
            type="submit"
          >
            Apply
          </Button>
        </div>
      </form>
    </Modal>
  );
};
