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

export const DeleteCustomBarcodeModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "delete-custom-barcode";

  const handleClose = () => {
    onClose();
    onOpen("custom-barcode", data);
  };

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      code_document: data?.code_document,
    };
    try {
      const res = await axios.delete(`${baseUrl}/deleteCustomBarcode`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: body,
      });
      cookies.set("detailManifestInbound", "updated");
      toast.success(res.data.data.message);
      onClose();
    } catch (error) {
      toast.error("Barcode");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  return (
    <Modal
      title="Delete Custom Barcode"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-sm"
    >
      <form onSubmit={onDelete} className="w-full flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={handleClose}
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
