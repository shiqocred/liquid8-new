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

export const QCDProductDetailRepairModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const router = useRouter();
  const accessToken = cookies.get("accessToken");
  const isModalOpen = isOpen && type === "qcd-product-detail-repair-modal";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${baseUrl}/update-repair-dump/${data.id}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully moved to QCD");
      if (data.last) {
        setTimeout(() => {
          toast.success("Repair bundle successfully deleted");
        }, 1000);
        router.push("/inventory/moving-product/repair");
      }
      cookies.set("detailRepairPage", "updated");
      onClose();
    } catch (error) {
      toast.error("Product failed move to QCD");
      console.log("ERROR_PRODUCT_MOVE_TO_QCD:", error);
    }
  };

  return (
    <Modal
      title="Move Product To QCD"
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
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
};
