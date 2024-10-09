"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { baseUrl } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";

export const DeleteProductDetailProductApproveModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "delete-detail-product-approve";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${baseUrl}/product-approves/${data}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      cookies.set("detailProductApprove", "updated");
      toast.success(
        "Data successfully deleted and returned to the product scan list"
      );
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  return (
    <Modal
      title="Delete Product Approve"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form onSubmit={onDelete} className="w-full flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-400/80 text-black w-full"
            type="submit"
          >
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
};
