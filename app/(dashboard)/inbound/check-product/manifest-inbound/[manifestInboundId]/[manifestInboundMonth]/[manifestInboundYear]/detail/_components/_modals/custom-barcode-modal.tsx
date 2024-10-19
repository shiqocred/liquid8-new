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

export const CustomBarcodeModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [input, setInput] = useState("");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "custom-barcode";

  const handleClose = () => {
    onClose();
    setInput("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      code_document: data?.code_document,
      init_barcode: input,
    };
    try {
      const res = await axios.post(`${baseUrl}/changeBarcodeDocument`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      cookies.set("detailManifestInbound", "updated");
      toast.success(res.data.data.message);
      handleClose();
    } catch (error) {
      toast.error("Barcode");
      console.log("ERROR_UPDATE_BARCODE:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setInput("");
      if (data?.custom_barcode) {
        setInput(data?.custom_barcode);
      }
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title="Approve Documents"
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
    >
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex flex-col border rounded border-gray-500 p-3 gap-2">
            <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-2">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Base Document
            </div>
            <h5 className="pl-6 text-sm">{data?.code_document}</h5>
          </div>
          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="customBarcode">Custom Barcode</Label>
            <div className="flex w-full gap-2">
              <Input
                id="customBarcode"
                className="w-full border-sky-400/80 focus-visible:ring-sky-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Custom Barcode..."
              />
              {data?.custom_barcode && (
                <Button
                  size={"icon"}
                  type="button"
                  onClick={() => onOpen("delete-custom-barcode", data)}
                  className="bg-red-50 hover:bg-red-100 border border-red-500 text-red-500 flex-none"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="bg-sky-400 hover:bg-sky-400/80 text-black w-full"
            type="submit"
          >
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
