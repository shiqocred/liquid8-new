"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";

export const StaggingProductApproveModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();

  const isModalOpen = isOpen && type === "staging-document-product-approve";

  const onStage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${baseUrl}/partial-staging/${data}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      cookies.set("productApprove", "updated");
      router.refresh();
      toast.success("Document successfully send to staging");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  return (
    <Modal
      title="To Partial Staging Document Product Approve"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
    >
      <form onSubmit={onStage} className="w-full flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-500/80 text-black w-full"
            type="submit"
          >
            To Partial Staging
          </Button>
        </div>
      </form>
    </Modal>
  );
};
