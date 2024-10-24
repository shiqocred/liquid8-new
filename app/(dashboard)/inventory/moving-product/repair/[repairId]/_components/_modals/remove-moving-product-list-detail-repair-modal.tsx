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

export const RemoveMovingProductListDetailRepairModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
const isModalOpen = isOpen && (type as string) === "remove-moving-product-list-detail-repair-modal";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(
        `${baseUrl}/delete_all_by_codeDocument?code_document=${data}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      cookies.set("productApprove", "updated");
      router.refresh();
      toast.success("Document successfully deleted");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  return (
    <Modal
      title="Delete Document Product Approve"
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
