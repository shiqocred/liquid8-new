"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import BarcodePrinted from "@/components/barcode";

export const BarcodePrinteredMovingProductDetailRepair = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "barcode-printered-moving-product-detail-repair";

  return (
    <Modal
      title="Barcode Printered"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
      className="w-fit"
    >
      <BarcodePrinted
        oldPrice={data?.oldPrice ?? "0"}
        barcode={data?.barcode ?? ""}
        category={data?.category ?? ""}
        newPrice={data?.newPrice ?? "0"}
        cancel={onClose}
      />
    </Modal>
  );
};
