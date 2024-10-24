"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { useRouter } from "next/navigation";

export const DeleteMovingProductRepairModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
  const isModalOpen = isOpen && type === "delete-moving-product-repair";

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`${baseUrl}/repair-mv/${data}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      cookies.set("repair", "repair");
      router.refresh();
      toast.success("Successfully deleted the moving product repair");
      onClose();
    } catch (error: any) {
      toast.error(`Error ${error.response.status}: Something went wrong`);
      console.log("ERROR_DELETE_PRODUCT:", error);
    }
  };

  return (
    <Modal
      title="Unrepair Moving Product Repair"
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
