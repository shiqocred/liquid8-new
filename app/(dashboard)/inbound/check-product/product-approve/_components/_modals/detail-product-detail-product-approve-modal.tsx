"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  FileSpreadsheet,
  ScanBarcode,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { baseUrl, formatRupiah } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import BarcodePrinted from "@/components/barcode";
import { useRouter } from "next/navigation";

interface QualityData {
  lolos: string | null;
  damaged: string | null;
  abnormal: string | null;
}

export const DetailProductDetailProductApproveModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    price: "0",
    qty: "1",
  });

  const isModalOpen =
    isOpen && type === "detail=product-detail-product-approve";

  const handleUpdate = async (e: FormEvent) => {
    const body = {
      code_document: data?.code_document,
      old_barcode_product: data?.old_barcode_product,
      new_barcode_product: data?.new_barcode_product,
      new_name_product: input.name,
      old_name_product: data?.new_name_product,
      new_quantity_product: input.qty,
      new_price_product: input.price,
      old_price_product: data?.old_price_product,
      new_date_in_product: data?.new_date_in_product,
      new_status_product: data?.new_status_product,
      condition: Object.keys(JSON.parse(data.new_quality)).find(
        (key) => JSON.parse(data.new_quality)[key as keyof QualityData] !== null
      ),
      new_category_product: data?.new_category_product,
      new_tag_product: data?.new_tag_product,
    };
    e.preventDefault();
    try {
      const res = await axios.put(
        `${baseUrl}/product-approves/${data?.id}`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully updated");
      cookies.set("productDetailProductApprove", res.data.data.resource.id);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen && data) {
      setInput({
        name: data?.new_name_product ?? "",
        price: data?.new_price_product ?? "0",
        qty: data?.new_quantity_product ?? "1",
      });
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title="Detail Product"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-4xl"
    >
      <div className="w-full relative overflow-hidden flex flex-col gap-4">
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
            <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-2">
              <ScanBarcode className="w-4 h-4 mr-2" />
              <div className="flex w-full items-center justify-between">
                <p>Old Data</p>
                <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
                  {data?.old_barcode_product}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col pl-6 w-full overflow-hidden gap-1">
                <p className="text-xs font-medium">Name Product</p>
                <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {data?.new_name_product}
                </p>
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
          <div className="flex w-full gap-3 items-center bg-gray-300 rounded-md px-5 py-2">
            <AlertCircle className="text-black h-4 w-4" />
            <p className="text-sm font-medium">
              To change the new price on the barcode, please update the product
              first.
            </p>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
              <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-2">
                <ScanBarcode className="w-4 h-4 mr-2" />
                <div className="flex w-full items-center justify-between">
                  <p>New Data</p>
                  <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
                    {data?.new_barcode_product}
                  </Badge>
                </div>
              </div>
              <form onSubmit={handleUpdate} className="flex flex-col gap-3">
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
                        setInput((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="Custom Barcode..."
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Label htmlFor="qtyNew" className="text-xs font-medium">
                      Qty
                    </Label>
                    <Input
                      id="qtyNew"
                      className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                      value={input.qty}
                      onChange={(e) =>
                        setInput((prev) => ({ ...prev, qty: e.target.value }))
                      }
                      placeholder="Custom Barcode..."
                    />
                  </div>
                </div>
                <Button
                  className="ml-6 mt-2 bg-sky-400/80 hover:bg-sky-400 text-black"
                  type="submit"
                >
                  Update
                </Button>
              </form>
            </div>
            <div className="w-fit flex flex-none">
              <BarcodePrinted
                barcode={data?.new_barcode_product}
                newPrice={data?.new_price_product}
                oldPrice={data?.old_price_product}
                category={data?.new_category_product}
              />
            </div>
          </div>
        </div>
        <div className="">
          <Button
            className=" bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
