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

export const CreateEditDestinationModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      phone: "",
      address: "",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-destination-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      alamat: input.address,
      phone_number: input.phone,
      shop_name: input.name,
    };
    try {
      const response = await axios.post(`${baseUrl}/destinations`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Destination successfully created");
      cookies.set("destinationPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Destination failed to create"
      );
      console.log("ERROR_CREATE_DESTINATION:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      alamat: input.address,
      phone_number: input.phone,
      shop_name: input.name,
    };
    try {
      const response = await axios.put(
        `${baseUrl}/destinations/${data?.id}`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Destination successfully updated");
      cookies.set("destinationPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err.response.data.data.message ?? "Destination failed to update"
      );
      console.log("ERROR_UPDATE_DESTINATION:", err);
    }
  };

  useEffect(() => {
    if (data && isModalOpen) {
      setInput({
        name: data?.name,
        address: data?.address,
        phone: data?.phone,
      });
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={data ? "Edit Destination" : "Create Destination"}
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
            <Label>Warehouse Name</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Warehouse name..."
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
          <div className="flex flex-col gap-1 w-full">
            <Label>No. Phone Warehouse</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="088888888888"
              value={input.phone}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Address Warehouse</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Address..."
              value={input.address}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
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
              data
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-green-400 hover:bg-green-400/80"
            )}
            type="submit"
          >
            {data ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
