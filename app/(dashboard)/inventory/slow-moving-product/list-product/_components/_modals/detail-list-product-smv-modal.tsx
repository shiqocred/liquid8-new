"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { CalendarX, ScanBarcode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DetailListProductSMVModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "detail-list-product-smv-modal";

  return (
    <Modal
      title="Detail Product"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
        <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-3">
          <ScanBarcode className="w-5 h-5 mr-2" />
          <div className="w-full flex justify-between items-center">
            Barcode:
            <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
              {data?.old_barcode_product}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3 flex-col my-4">
          <div className="flex flex-col w-full overflow-hidden gap-0.5">
            <p className="text-sm font-medium">Name Product</p>
            <p className="text-sm w-full whitespace-pre-wrap min-h-9 py-2 leading-relaxed flex items-center px-3 border-b border-sky-400/80 text-gray-600">
              {data?.new_name_product}
            </p>
          </div>
          <div className="flex flex-col w-full overflow-hidden gap-0.5">
            <p className="text-sm font-medium">Qty</p>
            <p className="text-sm w-full whitespace-pre-wrap min-h-9 flex items-center px-3 border-b border-sky-400/80 text-gray-600">
              {parseFloat(data?.new_quantity_product ?? "0").toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col w-full overflow-hidden gap-0.5">
            <p className="text-sm font-medium">Price</p>
            <p className="text-sm w-full whitespace-pre-wrap min-h-9 flex items-center px-3 border-b border-sky-400/80 text-gray-600">
              {formatRupiah(parseFloat(data?.old_price_product ?? "0"))}
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm font-semibold border-t justify-between border-gray-500 pt-3">
          <CalendarX className="w-5 h-5 mr-2" />
          <div className="w-full flex justify-between items-center">
            Experied Date:
            <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
              {data?.new_date_in_product}
            </Badge>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          className="bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
