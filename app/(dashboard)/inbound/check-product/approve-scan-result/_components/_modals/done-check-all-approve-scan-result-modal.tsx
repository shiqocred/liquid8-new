"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";

export const DoneCheckAllApproveScanResultModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen =
    isOpen && type === "done-check-all-approve-scan-result-modal";

  const handleDoneCheckAll = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/stagingTransactionApprove`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully checked all");
      cookies.set("approveScanResult", "updated");
    } catch (err: any) {
      toast.error("Something went wrong.");
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
            className="bg-green-400 hover:bg-green-400/80 text-black w-full"
            type="submit"
          >
            Done
          </Button>
        </div>
      </form>
    </Modal>
  );
};
