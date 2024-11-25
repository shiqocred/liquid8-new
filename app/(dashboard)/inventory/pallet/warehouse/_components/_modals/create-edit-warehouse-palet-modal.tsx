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
import {
  PopoverPortal,
  PopoverPortalContent,
  PopoverPortalTrigger,
} from "@/components/ui/popoverPortal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import slug from "slug";

const urlWilayah = "http://localhost:3001/api";

export const CreateEditWarehousePaletModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [isOpenProv, setIsOpenProv] = useState(false);
  const [isOpenKab, setIsOpenKab] = useState(false);
  const [isOpenKec, setIsOpenKec] = useState(false);
  const [provinsi, setProvinsi] = useState<any[]>([]);
  const [kabupaten, setKabupaten] = useState<any[]>([]);
  const [kecamatan, setKecamatan] = useState<any[]>([]);

  const [input, setInput] = useState({
    name: "",
    phone: "",
    address: "",
    provinsi: { nama: "", slug: "" },
    kabupaten: "",
    kecamatan: "",
    latitude: "",
    longitude: "",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      phone: "",
      address: "",
      provinsi: { nama: "", slug: "" },
      kabupaten: "",
      kecamatan: "",
      latitude: "",
      longitude: "",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-warehouse-palet-modal";

  const handleGetProvinsi = async () => {
    try {
      const response = await axios.get(`${urlWilayah}/wilayah`, {
        headers: {
          Accept: "application/json",
        },
      });
      setProvinsi(response.data);
    } catch (err: any) {
      toast.error("GET PROVINSI: Something went wrong.");
      console.log("ERROR_GET_PROVINSI:", err);
    }
  };
  const handleGetKabupaten = async (kab: any) => {
    try {
      const response = await axios.get(`${urlWilayah}/wilayah/${kab}`, {
        headers: {
          Accept: "application/json",
        },
      });
      setKabupaten(response.data);
    } catch (err: any) {
      toast.error("GET KABUPATEN: Something went wrong.");
      console.log("ERROR_GET_KABUPATEN:", err);
    }
  };
  const handleGetKecamatan = async (kec: any, pro?: any) => {
    try {
      const response = await axios.get(
        `${urlWilayah}/wilayah/${pro ?? input.provinsi.slug}/${kec}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      setKecamatan(response.data);
    } catch (err: any) {
      toast.error("GET KECAMATAN: Something went wrong.");
      console.log("ERROR_GET_KECAMATAN:", err);
    }
  };
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      nama: input.name,
      alamat: input.address,
      provinsi: input.provinsi.nama,
      kabupaten: input.kabupaten,
      kota: input.kabupaten,
      kecamatan: input.kecamatan,
      no_hp: input.phone,
      latitude: input.latitude,
      longitude: input.longitude,
    };
    try {
      await axios.post(`${baseUrl}/warehouses`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Warehouse successfully created");
      cookies.set("warehousePage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Warehouse failed to create"
      );
      console.log("ERROR_CREATE_WAREHOUSE:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      nama: input.name,
      alamat: input.address,
      provinsi: input.provinsi.nama,
      kabupaten: input.kabupaten,
      kota: input.kabupaten,
      kecamatan: input.kecamatan,
      no_hp: input.phone,
      latitude: input.latitude,
      longitude: input.longitude,
    };
    try {
      await axios.put(`${baseUrl}/warehouses/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Warehouse successfully updated");
      cookies.set("warehousePage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.data?.message ?? "Warehouse failed to update"
      );
      console.log("ERROR_UPDATE_WAREHOUSE:", err);
    }
  };

  useEffect(() => {
    if (data && isModalOpen) {
      setInput(data);
      handleGetKabupaten(data?.provinsi.slug);
      handleGetKecamatan(slug(data?.kabupaten, "_"), data?.provinsi.slug);
      console.log(slug(data?.kabupaten, "_"));
    }
  }, [data, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetProvinsi();
    }
  }, [isModalOpen]);

  return (
    <Modal
      title={data?.id ? "Edit Destination" : "Create Destination"}
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
            <Label>No. Phone</Label>
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
            <Label>Address</Label>
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
          <div className="flex flex-col gap-1 w-full">
            <Label>Provinsi</Label>
            <PopoverPortal open={isOpenProv} onOpenChange={setIsOpenProv}>
              <PopoverPortalTrigger asChild>
                <Button
                  type="button"
                  className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                >
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start">
                    {input.provinsi.nama
                      ? input.provinsi.nama
                      : "Select Provinsi..."}
                  </p>
                  <ChevronDown className="size-4 flex-none" />
                </Button>
              </PopoverPortalTrigger>
              <PopoverPortalContent className="p-0">
                <Command>
                  <CommandInput />
                  <CommandList>
                    <CommandEmpty>Data Not Found.</CommandEmpty>
                    <CommandGroup>
                      {provinsi.map((item) => (
                        <CommandItem
                          onSelect={() => {
                            handleGetKabupaten(item.slug);
                            setIsOpenProv(false);
                            setInput((prev) => ({
                              ...prev,
                              provinsi: {
                                nama: item.nama,
                                slug: item.slug,
                              },
                              kabupaten: "",
                              kecamatan: "",
                            }));
                          }}
                          key={item.id}
                        >
                          {item.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverPortalContent>
            </PopoverPortal>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Kabupaten</Label>
            <PopoverPortal open={isOpenKab} onOpenChange={setIsOpenKab}>
              <PopoverPortalTrigger asChild>
                <Button
                  type="button"
                  disabled={!input.provinsi.slug}
                  className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                >
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start">
                    {input.kabupaten ? input.kabupaten : "Select Kabupaten..."}
                  </p>
                  <ChevronDown className="size-4 flex-none" />
                </Button>
              </PopoverPortalTrigger>
              <PopoverPortalContent className="p-0">
                <Command>
                  <CommandInput />
                  <CommandList>
                    <CommandEmpty>Data Not Found.</CommandEmpty>
                    <CommandGroup>
                      {kabupaten.map((item) => (
                        <CommandItem
                          onSelect={() => {
                            handleGetKecamatan(item.slug);
                            setIsOpenKab(false);
                            setInput((prev) => ({
                              ...prev,
                              kabupaten: item.nama,
                              kecamatan: "",
                            }));
                          }}
                          key={item.id}
                        >
                          {item.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverPortalContent>
            </PopoverPortal>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Kecamatan</Label>
            <PopoverPortal open={isOpenKec} onOpenChange={setIsOpenKec}>
              <PopoverPortalTrigger asChild>
                <Button
                  type="button"
                  disabled={!input.kabupaten}
                  className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                >
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start">
                    {input.kecamatan ? input.kecamatan : "Select Kecamatan..."}
                  </p>
                  <ChevronDown className="size-4 flex-none" />
                </Button>
              </PopoverPortalTrigger>
              <PopoverPortalContent className="p-0">
                <Command>
                  <CommandInput />
                  <CommandList>
                    <CommandEmpty>Data Not Found.</CommandEmpty>
                    <CommandGroup>
                      {kecamatan.map((item) => (
                        <CommandItem
                          onSelect={() => {
                            setInput((prev) => ({
                              ...prev,
                              kecamatan: item.nama,
                            }));
                            setIsOpenKec(false);
                          }}
                          key={item.id}
                        >
                          {item.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverPortalContent>
            </PopoverPortal>
          </div>
          <div className="w-full flex items-center gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Label>Latitude</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                value={input.latitude}
                // disabled={loadingSubmit}
                type="number"
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Longitude</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                value={input.longitude}
                type="number"
                // disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    longitude: e.target.value,
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
              !input.address ||
              !input.kabupaten ||
              !input.kecamatan ||
              !input.latitude ||
              !input.longitude ||
              !input.phone ||
              !input.provinsi.nama
            }
          >
            {data?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
