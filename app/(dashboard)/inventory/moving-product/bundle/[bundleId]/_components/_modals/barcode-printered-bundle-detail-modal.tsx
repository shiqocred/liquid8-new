"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import BarcodePrinted from "@/components/barcode";

export const BarcodePrinteredBundleDetailModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen =
    isOpen && type === "barcode-printered-bundle-detail-modal";

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
        isBundle
        cancel={onClose}
      />
    </Modal>
  );
};
