"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { useRouter } from "next/navigation";

export const DoneCheckAllBKLModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "done-check-all-bkl-modal";

  const handleDoneCheckAll = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/bkls`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("BKL successfully checked all");
      cookies.set("updateBKLProduct", "checkedAll");
      cookies.set("updateBKLFilteredProduct", "checkedAll");
      router.push("/inventory/slow-moving-product/bkl");
      onClose();
    } catch (err: any) {
      toast.error(err.response.data.message ?? "BKL failed to check all");
      console.log("[ERROR_DONE_CHECK_ALL_BKL]:", err);
    }
  };

  return (
    <Modal
      title="Check All BKL"
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
