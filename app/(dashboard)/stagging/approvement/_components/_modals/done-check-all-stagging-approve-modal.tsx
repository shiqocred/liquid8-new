"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";

export const DoneCheckAllStaggingApproveModal = () => {
  const { isOpen, onClose, type } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen =
    isOpen && type === "done-check-all-stagging-approve-modal";

  const handleDoneCheckAll = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.get(`${baseUrl}/stagingTransactionApprove`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully checked all");
      cookies.set("approveScanResult", "updated");
      onClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Product failed to check all"
      );
      console.log("ERROR_DONE_CHECK_ALL_STAGGING_APRV:", err);
    }
  };

  return (
    <Modal
      title="Check All Product"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form
        onSubmit={handleDoneCheckAll}
        className="w-full flex flex-col gap-4"
      >
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
            Done
          </Button>
        </div>
      </form>
    </Modal>
  );
};
