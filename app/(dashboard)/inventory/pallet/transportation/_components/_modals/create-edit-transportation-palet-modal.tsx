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
import { AlertCircle } from "lucide-react";

export const CreateEditTransportationPaletModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      length: "",
      width: "",
      height: "",
    });
  };

  const isModalOpen =
    isOpen && type === "create-edit-transportation-palet-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      vehicle_name: input.name,
      cargo_length: input.length,
      cargo_height: input.height,
      cargo_width: input.width,
    };
    try {
      await axios.post(`${baseUrl}/vehicle-types`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Transportation successfully created");
      cookies.set("transportationPaletPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Transportation failed to create"
      );
      console.log("ERROR_CREATE_TRANSPORTATION:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      vehicle_name: input.name,
      cargo_length: input.length,
      cargo_height: input.height,
      cargo_width: input.width,
    };
    try {
      await axios.put(`${baseUrl}/vehicle-types/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Transportation successfully updated");
      cookies.set("transportationPaletPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Transportation failed to update"
      );
      console.log("ERROR_UPDATE_TRANSPORTATION:", err);
    }
  };

  useEffect(() => {
    if (data && isModalOpen) {
      setInput(data);
    }
  }, [data, isModalOpen]);

  useEffect(() => {
    if (isNaN(parseFloat(input.height))) {
      setInput((prev) => ({ ...prev, height: "0" }));
    }
    if (isNaN(parseFloat(input.length))) {
      setInput((prev) => ({ ...prev, length: "0" }));
    }
    if (isNaN(parseFloat(input.width))) {
      setInput((prev) => ({ ...prev, width: "0" }));
    }
  }, [input]);

  return (
    <Modal
      title={data?.id ? "Edit Transportation" : "Create Transportation"}
      description=""
      isOpen={isModalOpen}
      onClose={handleClose}
      className="max-w-xl"
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
              placeholder="Transportation name..."
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
          <div className="w-full flex items-center gap-2 rounded px-5 py-2.5 bg-sky-200/80 border border-sky-400 text-sm">
            <AlertCircle className="size-4" />
            <p>
              The unit of measurement used is{" "}
              <span className="font-semibold">meters</span>
            </p>
          </div>
          <div className="w-full grid-cols-3 gap-4 grid">
            <div className="flex flex-col gap-1 w-full">
              <Label>Length</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="0"
                value={input.length}
                // disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    length: e.target.value.startsWith("0")
                      ? e.target.value.replace(/^0+/, "")
                      : e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Width</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="0"
                value={input.width}
                // disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    width: e.target.value.startsWith("0")
                      ? e.target.value.replace(/^0+/, "")
                      : e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Height</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="0"
                value={input.height}
                // disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    height: e.target.value.startsWith("0")
                      ? e.target.value.replace(/^0+/, "")
                      : e.target.value,
                  }))
                }
              />
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
              data?.id
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-sky-400 hover:bg-sky-400/80"
            )}
            type="submit"
            disabled={
              !input.name ||
              parseFloat(input.length) < 1 ||
              parseFloat(input.width) < 1 ||
              parseFloat(input.height) < 1
            }
          >
            {data?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
