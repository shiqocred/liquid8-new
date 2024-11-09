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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";

export const CreateEditAccountModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isOpenRole, setIsOpenRole] = useState(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const [input, setInput] = useState({
    name: "",
    roleId: "",
    username: "",
    password: "",
    email: "",
  });

  const handleClose = () => {
    onClose();
    setInput({
      name: "",
      roleId: "",
      username: "",
      password: "",
      email: "",
    });
  };

  const isModalOpen = isOpen && type === "create-edit-account-modal";

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      email: input.email,
      name: input.name,
      password: input.password,
      role_id: input.roleId,
      username: input.username,
    };
    try {
      const response = await axios.post(`${baseUrl}/register`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Account successfully created");
      cookies.set("accountPage", "created");
      handleClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Account failed to create");
      console.log("ERROR_CREATE_ACCOUNT:", err);
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      email: input.email,
      name: input.name,
      password: input.password,
      role_id: input.roleId,
      username: input.username,
    };
    try {
      const response = await axios.put(`${baseUrl}/users/${data?.id}`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Account successfully updated");
      cookies.set("accountPage", "updated");
      handleClose();
    } catch (err: any) {
      toast.error(err.response.data.data.message ?? "Account failed to update");
      console.log("ERROR_UPDATE_ACCOUNT:", err);
    }
  };

  useEffect(() => {
    if (data && isModalOpen) {
      setInput((prev) => ({
        ...prev,
        name: data?.name,
        username: data?.username,
        email: data?.email,
        roleId: data?.roleId,
      }));
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={data?.id ? "Edit Account" : "Create Account"}
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
              placeholder="Jhon Doe"
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
            <Label>Role</Label>
            <Popover
              modal={true}
              open={isOpenRole}
              onOpenChange={setIsOpenRole}
            >
              <PopoverTrigger asChild>
                <Button className="rounded-none shadow-none border-b border-sky-400/80 bg-transparent hover:bg-transparent hover:border-sky-500 justify-between text-black">
                  {data?.role &&
                    (data?.role.find((item: any) => item.id === input.roleId)
                      ?.role_name ??
                      "Pilih Role")}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-1 border-sky-500 shadow-lg text-sm font-medium">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data?.role && (
                      <CommandGroup>
                        {data?.role.map((item: any) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              setInput((prev) => ({
                                ...prev,
                                roleId: item.id,
                              }));
                              setIsOpenRole(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "w-4 h-4 mr-2",
                                input.roleId === item.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.role_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>UserName</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="Jhon"
              value={input.username}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Email</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="example@mail.com"
              type="email"
              value={input.email}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>Password</Label>
            <Input
              className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
              placeholder="*****"
              type="password"
              value={input.password}
              // disabled={loadingSubmit}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  password: e.target.value,
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
              data?.id
                ? "bg-yellow-400 hover:bg-yellow-400/80"
                : "bg-green-400 hover:bg-green-400/80"
            )}
            type="submit"
          >
            {data?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
