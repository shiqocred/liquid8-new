"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

export const DeleteProductApproveModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "approve-documents";

  const onDelete = async (e: FormEvent) => {};

  return (
    <Modal
      title="Approve Documents"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
    >
      <div className="w-full flex flex-col gap-4">
        <p>Are you sure to approve this data?</p>
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Disgard
          </Button>
          <Button
            className="bg-green-400 hover:bg-green-400/80 text-black w-full"
            onClick={onDelete}
          >
            Approve
          </Button>
        </div>
      </div>
    </Modal>
  );
};
