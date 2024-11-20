"use client";

import React, { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";

export const DisplayProductDetailRepairModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
  const isModalOpen = isOpen && type === "display-product-detail-repair-modal";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`${baseUrl}/product-repair/${data.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully moved to display");
      if (data.last) {
        setTimeout(() => {
          toast.success("Repair bundle successfully deleted");
        }, 1000);
        router.push("/inventory/moving-product/repair");
      }
      cookies.set("detailRepairPage", "updated");
      onClose();
    } catch (error) {
      toast.success("Product failed move to display");
      console.log("ERROR_TO_DISPLAY_PRODUCT:", error);
    }
  };

  return (
    <Modal
      title="To Display Product"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
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
