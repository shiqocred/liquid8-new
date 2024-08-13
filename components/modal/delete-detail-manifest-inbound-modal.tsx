"use client";

import React, { FormEvent } from "react";
import { Modal } from "../modal";
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const DeleteDetailManifestInboundModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "delete-detail-manifest-inbound";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      const id = data;
      const authToken = process.env.NEXT_PUBLIC_authToken;
      const apiUrl = process.env.NEXT_PUBLIC_baseUrl;

      await axios.delete(`${apiUrl}/product_olds/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      onClose();
      router.refresh();
    } catch (err) {
      console.error("Failed to delete the item", err);
    }
  };

  return (
    <Modal
      title="Delete Detail Manifest Inbound"
      description="This is a Permanent action"
      isOpen={isModalOpen}
      onClose={onClose}
    >
      <div className="w-full flex flex-col gap-4">
        <p>Are you sure to delete this data?</p>
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Discard
          </Button>
          <Button variant={"destructive"} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDetailManifestInboundModal;
