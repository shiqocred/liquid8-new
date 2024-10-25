"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import BarcodePrinted from "@/components/barcode";
import { useRouter } from "next/navigation";

export const BarcodePrinteredLPRModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "barcode-printered-lpr-modal";

  const cancelButton = () => {
    onClose();
    router.push(data?.cancel);
  };

  return (
    <Modal
      title="Barcode Printered"
      description=""
      isOpen={isModalOpen}
      onClose={cancelButton}
      className="w-fit"
    >
      <BarcodePrinted
        oldPrice={data?.oldPrice ?? "0"}
        barcode={data?.barcode ?? ""}
        category={data?.category ?? ""}
        newPrice={data?.newPrice ?? "0"}
        isBundle
        cancel={cancelButton}
      />
    </Modal>
  );
};
