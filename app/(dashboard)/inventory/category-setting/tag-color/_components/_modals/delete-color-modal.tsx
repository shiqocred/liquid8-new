"use client";

import React, { FormEvent } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";

export const DeleteColorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "delete-color-modal";

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`${baseUrl}/color_tags/${data}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Tag Color WMS successfully deleted");
      cookies.set("colorPage", "moved");
      onClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Tag Color WMS failed to delete"
      );
      console.log("ERROR_DELETE_COLOR_WMS:", err);
    }
  };
  const handleDelete2 = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`${baseUrl}/color_tags2/${data}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Tag Color APK successfully deleted");
      cookies.set("color2Page", "moved");
      onClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Tag Color APK failed to delete"
      );
      console.log("ERROR_DELETE_COLOR_APK:", err);
    }
  };

  return (
    <Modal
      title={`Delete Color ${data?.type === "wms" ? "WMS" : "APK"}`}
      description="Are you Sure? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <form
        onSubmit={data?.type === "wms" ? handleDelete : handleDelete2}
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
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
};
