"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import slug from "slug";

export const CreateEditBrandPaletModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    slug: "",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      slug: "",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-brand-palet-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      brand_name: input.name,
      brand_slug: input.slug,
    };
    try {
      await axios.post(`${baseUrl}/product-brands`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Brand successfully created");
      cookies.set("brandPaletPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Brand failed to create"
      );
      console.log("ERROR_CREATE_BRAND:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      brand_name: input.name,
      brand_slug: input.slug,
    };
    try {
      await axios.put(`${baseUrl}/product-brands/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Brand successfully updated");
      cookies.set("brandPaletPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Brand failed to update"
      );
      console.log("ERROR_UPDATE_BRAND:", err);
    }
  };

  useEffect(() => {
    if (data && isModalOpen) {
      setInput(data);
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={data?.id ? "Edit Brand" : "Create Brand"}
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-md"
    >
      <form
        onSubmit={!data?.id ? handleCreate : handleEdit}
        className="w-full flex flex-col gap-4"
      >
        <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
          <div className="flex flex-col gap-1 w-full">
            <Label>Name</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Brand name..."
              value={input.name}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: slug(e.target.value, "-"),
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Slug</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="brand-slug"
              value={input.slug}
              disabled
            />
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
            className={cn(
              "text-black w-full",
              data?.id
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-sky-400 hover:bg-sky-400/80"
            )}
            type="submit"
            disabled={!input.name || !input.slug}
          >
            {data?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
