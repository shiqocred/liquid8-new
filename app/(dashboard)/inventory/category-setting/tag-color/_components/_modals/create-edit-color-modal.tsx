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
import { ChevronRight, Minus, Percent } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import PickerColor from "@/components/picker-color";
import { Separator } from "@/components/ui/separator";

export const CreateEditColorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [newHex, setNewHex] = useState("#000000");

  const [input, setInput] = useState({
    name: "",
    fixPrice: "0",
    minPrice: "0",
    maxPrice: "0",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      fixPrice: "0",
      minPrice: "0",
      maxPrice: "0",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-color-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      hexa_code_color: newHex,
      name_color: input.name,
      min_price_color: input.minPrice,
      max_price_color: input.maxPrice,
      fixed_price_color: input.fixPrice,
    };
    try {
      await axios.post(`${baseUrl}/color_tags`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("WMS Color successfully created");
      cookies.set("colorPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "WMS Color failed to create"
      );
      console.log("ERROR_CREATE_COLOR_WMS:", err);
    }
  };
  const handleCreate2 = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      hexa_code_color: newHex,
      name_color: input.name,
      min_price_color: input.minPrice,
      max_price_color: input.maxPrice,
      fixed_price_color: input.fixPrice,
    };
    try {
      await axios.post(`${baseUrl}/color_tags2`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("APK Color successfully created");
      cookies.set("color2Page", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "APK Color failed to create"
      );
      console.log("ERROR_CREATE_COLOR_WMS:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      hexa_code_color: newHex,
      name_color: input.name,
      min_price_color: input.minPrice,
      max_price_color: input.maxPrice,
      fixed_price_color: input.fixPrice,
    };
    try {
      await axios.put(`${baseUrl}/color_tags/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("WMS Color successfully updated");
      cookies.set("colorPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "WMS Color failed to update"
      );
      console.log("ERROR_UPDATE_COLOR_WMS:", err);
    }
  };
  const handleEdit2 = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      hexa_code_color: newHex,
      name_color: input.name,
      min_price_color: input.minPrice,
      max_price_color: input.maxPrice,
      fixed_price_color: input.fixPrice,
    };
    try {
      await axios.put(`${baseUrl}/color_tags2/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("APK Color successfully updated");
      cookies.set("color2Page", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "APK Color failed to update"
      );
      console.log("ERROR_UPDATE_COLOR_APK:", err);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(input.fixPrice))) {
      setInput((prev) => ({ ...prev, fixPrice: "0" }));
    }
    if (isNaN(parseFloat(input.maxPrice))) {
      setInput((prev) => ({ ...prev, maxPrice: "0" }));
    }
    if (isNaN(parseFloat(input.minPrice))) {
      setInput((prev) => ({ ...prev, minPrice: "0" }));
    }
  }, [input]);

  useEffect(() => {
    setInput((prev) => ({ ...prev, hex: newHex }));
  }, [newHex]);

  useEffect(() => {
    if (data?.name && isModalOpen) {
      setInput({
        name: data?.name,
        fixPrice: Math.ceil(data?.fixPrice).toString(),
        minPrice: Math.ceil(data?.minPrice).toString(),
        maxPrice: Math.ceil(data?.maxPrice).toString(),
      });
      setNewHex(data?.hex);
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={
        data?.name
          ? data?.type === "wms"
            ? "Edit Color WMS"
            : "Edit Color APK"
          : data?.type === "wms"
          ? "Create Color WMS"
          : "Create Color APK"
      }
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-xl"
    >
      <form
        onSubmit={
          data?.name
            ? data?.type === "wms"
              ? handleEdit
              : handleEdit2
            : data?.type === "wms"
            ? handleCreate
            : handleCreate2
        }
        className="w-full flex flex-col gap-4"
      >
        <div className="border p-4 rounded border-sky-500 gap-4 flex flex-col">
          <div className="flex flex-col gap-1 w-full">
            <Label>Color Name</Label>
            <Dialog
              modal={true}
              open={isOpenDialog}
              onOpenChange={setIsOpenDialog}
            >
              <DialogTrigger asChild>
                <button className="text-black w-full flex items-center gap-3 p-1 border-b border-0 border-sky-400">
                  <div
                    style={{ background: newHex }}
                    className="w-9 flex-none rounded shadow h-9 border"
                  />
                  <div className="w-full flex items-center justify-center rounded h-9 text-sm font-medium ">
                    {newHex}
                  </div>
                  <div className="flex w-9 h-9 rounded flex-none items-center justify-center bg-sky-400">
                    <ChevronRight className="size-4" />
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="p-3">
                <DialogHeader>
                  <DialogTitle>Color Picker</DialogTitle>
                  <DialogDescription>The color is autosave</DialogDescription>
                </DialogHeader>
                <PickerColor
                  hexColor={newHex}
                  setHexColor={setNewHex}
                  isOpen={isModalOpen}
                />
                <Button
                  className="bg-sky-400/80 hover:bg-sky-500 text-black"
                  onClick={() => setIsOpenDialog(false)}
                >
                  Confirm
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Color Name</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Color name..."
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
            <Label>Fixed Price</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Rp 0"
              value={input.fixPrice}
              type="number"
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  fixPrice: e.target.value.startsWith("0")
                    ? e.target.value.replace(/^0+/, "")
                    : e.target.value,
                }))
              }
            />
            <p className="absolute right-3 bottom-2 text-xs text-gray-400">
              {formatRupiah(parseFloat(input.fixPrice)) ?? "Rp 0"}
            </p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full relative">
              <Label>Min Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="Rp 0"
                value={input.minPrice}
                type="number"
                // disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    minPrice: e.target.value.startsWith("0")
                      ? e.target.value.replace(/^0+/, "")
                      : e.target.value,
                  }))
                }
              />
              <p className="absolute right-3 bottom-2 text-xs text-gray-400">
                {formatRupiah(parseFloat(input.minPrice)) ?? "Rp 0"}
              </p>
            </div>
            <Minus className="size-3" />
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
              data?.name
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-sky-400 hover:bg-sky-400/80"
            )}
            type="submit"
            disabled={!input.name || !newHex}
          >
            {data?.name ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
