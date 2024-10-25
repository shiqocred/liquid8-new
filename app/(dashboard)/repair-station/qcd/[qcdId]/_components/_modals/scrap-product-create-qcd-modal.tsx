"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";

export const ScrapProductCreateQCDModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "scrap-product-create-qcd-modal";

  const handleScrapProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(
        `${baseUrl}/new_products/${data}`,

        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully scraped");
      cookies.set("createQCD", "scrap");
      cookies.set("createQCDFiltered", "scrap");
      onClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Product failed to scrap");
      console.log("ERROR_SCRAP_PRODUCT:", err);
    }
  };

  return (
    <Modal
      title="Scrap Product"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form
        onSubmit={handleScrapProduct}
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
