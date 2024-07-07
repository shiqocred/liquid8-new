import React from "react";
import { Button } from "../ui/button";
import { Bell, Crown, LogOut, Wifi } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full h-14 border-b bg-white flex justify-end items-center px-4 gap-4 py-2">
      <Badge className="bg-sky-500 hover:bg-sky-500 text-white rounded-full gap-2 p-1 pr-2">
        <div className="h-4 w-4 bg-white flex items-center justify-center text-yellow-500 rounded-full">
          <Crown className="w-2.5 h-2.5 fill-yellow-500" />
        </div>
        Superadmin
      </Badge>
      <Separator orientation="vertical" />
      <div className="flex items-center text-sm gap-3">
        <div className="w-7 h-7 relative ">
          <Image
            className="object-cover"
            src={"/images/liquid.png"}
            alt=""
            fill
          />
        </div>
        <div className="flex flex-col min-w-24 gap-1">
          <p className="capitalize font-semibold leading-none">michael</p>
          <p className="lowercase text-xs text-gray-500 font-light leading-none">
            mike@liquid.id
          </p>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex gap-2 items-center">
        <TooltipProviderPage
          className="bg-white border text-black"
          sideOffset={15}
          value={
            <div className="flex items-center gap-2 relative">
              <div className="w-3 h-3 rounded-full bg-green-500 relative" />
              <div className="w-3 h-3 rounded-full bg-green-500 absolute animate-ping opacity-75" />
              <p>250 kbps</p>
            </div>
          }
        >
          <div className="flex h-8 w-auto items-center justify-center shadow rounded-full px-2 gap-2 bg-green-50 border border-green-500">
            <Wifi className="w-4 h-4 text-green-500" />
          </div>
        </TooltipProviderPage>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-gray-50 text-black">
              <Bell className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-1 gap-1 flex flex-col"
            align="end"
            sideOffset={15}
          >
            <div className="flex justify-between w-full items-center px-2.5 py-1">
              <p className="text-sm font-semibold">Notification</p>
              <Link href={"/notification"}>
                <Button className="text-xs h-auto py-1 px-2 bg-sky-500 hover:bg-sky-600">
                  Open
                </Button>
              </Link>
            </div>
            <Separator />
            <div className=" flex flex-col hover:bg-gray-50 px-2.5 py-1 rounded">
              <p className="text-sm font-medium capitalize">judul</p>
              <p className="text-xs font-light text-gray-500">tanggal</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Separator orientation="vertical" />
      <Button className="w-8 h-8 p-0 bg-red-100 text-red-500 hover:bg-red-200">
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Navbar;
