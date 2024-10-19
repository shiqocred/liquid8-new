"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { ScanBarcode } from "lucide-react";
import { baseUrl } from "@/lib/baseUrl";

export const DoubleBarcodeManifestInboundModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "double-barcode-manifet-inbound";

  const onConfirm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/addProductOld`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success(response.data.data.message);
      cookies.set("updatedBarcode", "updated");
      if (response.data.data.resource.new_category_product) {
        onOpen("manifest-inbound-barcode-printered", {
          barcode: response.data.data.resource.new_barcode_product,
          newPrice: response.data.data.resource.new_price_product,
          oldPrice: response.data.data.resource.old_price_product,
          category: response.data.data.resource.new_category_product,
        });
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("ERROR_SUBMIT_DUPLICATE_BARCODE:", error);
    }
  };

  return (
    <Modal
      title="Barcode Duplication Confirmation"
      description="Confirm to submit the same barcode again."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form onSubmit={onConfirm} className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center border rounded border-gray-500 p-3 gap-2 text-sm font-medium">
          <ScanBarcode className="w-5 h-5" />
          {data?.old_barcode_product}
        </div>
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="bg-sky-400 hover:bg-sky-400/80 text-black w-full"
            type="submit"
          >
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
};
