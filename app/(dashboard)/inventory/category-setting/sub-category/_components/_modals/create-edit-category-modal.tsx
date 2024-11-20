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
import { cn, formatRupiah } from "@/lib/utils";
import { Percent } from "lucide-react";

export const CreateEditCategoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    discount: "0",
    maxPrice: "0",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      discount: "0",
      maxPrice: "0",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-category-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      name_category: input.name,
      discount_category: input.discount,
      max_price_category: input.maxPrice,
    };
    try {
      const response = await axios.post(`${baseUrl}/categories`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Category successfully created");
      cookies.set("categoryPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Category failed to create"
      );
      console.log("ERROR_CREATE_CATEGORY:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      name_category: input.name,
      discount_category: input.discount,
      max_price_category: input.maxPrice,
    };
    try {
      const response = await axios.put(
        `${baseUrl}/categories/${data?.id}`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Category successfully updated");
      cookies.set("categoryPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Category failed to update"
      );
      console.log("ERROR_UPDATE_CATEGORY:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.discount))) {
      setInput((prev) => ({ ...prev, discount: "0" }));
    }
    if (isNaN(parseFloat(input.maxPrice))) {
      setInput((prev) => ({ ...prev, maxPrice: "0" }));
    }
  }, [input]);

  useEffect(() => {
    if (data && isModalOpen) {
      setInput({
        name: data?.name,
        discount: data?.discount,
        maxPrice: Math.ceil(data?.maxPrice).toString(),
      });
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={data ? "Edit Category" : "Create Category"}
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-xl"
    >
      <form
        onSubmit={!data ? handleCreate : handleEdit}
        className="w-full flex flex-col gap-4"
      >
        <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
          <div className="flex flex-col gap-1 w-full">
            <Label>Category Name</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Category name..."
              value={input.name}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full relative">
            <Label>Discount</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="0"
              value={input.discount}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  discount: e.target.value.startsWith("0")
                    ? e.target.value.replace(/^0+/, "")
                    : e.target.value,
                }))
              }
            />
            <Percent className="size-4 absolute right-3 bottom-2" />
          </div>
          <div className="flex flex-col gap-1 w-full relative">
            <Label>Max Price</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Rp 0"
              value={input.maxPrice}
              type="number"
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  maxPrice: e.target.value.startsWith("0")
                    ? e.target.value.replace(/^0+/, "")
                    : e.target.value,
                }))
              }
            />
            <p className="absolute right-3 bottom-2 text-xs text-gray-400">
              {formatRupiah(parseFloat(input.maxPrice)) ?? "Rp 0"}
            </p>
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
              data
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-sky-400 hover:bg-sky-400/80"
            )}
            type="submit"
            disabled={
              !input.name ||
              parseFloat(input.maxPrice) <= 0 ||
              parseFloat(input.discount) < 0
            }
          >
            {data ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
