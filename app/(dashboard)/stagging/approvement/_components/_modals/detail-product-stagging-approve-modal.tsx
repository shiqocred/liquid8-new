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
import { formatRupiah } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import BarcodePrinted from "@/components/barcode";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const DetailProductStaggingApproveModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "detail-product-stagging-approve";

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
              <div className="flex flex-col gap-3">
                <div className="flex flex-col pl-6 w-full overflow-hidden gap-1">
                  <p className="text-xs font-medium">Name Product</p>
                  <p className="text-sm font-light font-mono text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {data?.new_name_product}
                  </p>
                </div>
                <Separator />
                <div className="w-full flex-none pl-6 flex gap-2 ">
                  <div className="flex flex-col w-full overflow-hidden gap-1">
                    <p className="text-xs font-medium">Price</p>
                    <p className="text-sm font-light font-mono text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatRupiah(parseFloat(data?.new_price_product))}
                    </p>
                  </div>
                  <div className="flex flex-col w-full overflow-hidden gap-1">
                    <p className="text-xs font-medium">Qty</p>
                    <p className="text-sm font-light font-mono text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {data?.new_quantity_product}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="w-full flex-none pl-6 flex gap-2 ">
                  <div className="flex flex-col w-full overflow-hidden gap-1">
                    <p className="text-xs font-medium">Discount</p>
                    <p className="text-sm font-light font-mono text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {Math.round(parseFloat(data?.new_discount))} %
                    </p>
                  </div>
                  <div className="flex flex-col w-full overflow-hidden gap-1">
                    <p className="text-xs font-medium">Display Price</p>
                    <p className="text-sm font-light font-mono text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatRupiah(parseFloat(data?.display_price))}
                    </p>
                  </div>
                </div>
              </div>
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
