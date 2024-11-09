"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";

export const DeleteAccountModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "delete-account-modal";

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${baseUrl}/users/${data}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Account successfully deleted");
      cookies.set("accountPage", "moved");
      onClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Account failed to delete");
      console.log("ERROR_DELETE_ACCOUNT:", err);
    }
  };

  return (
    <Modal
      title="Delete Account"
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form onSubmit={handleDelete} className="w-full flex flex-col gap-4">
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
