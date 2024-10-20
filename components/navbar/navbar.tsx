"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bell, Crown, LogOut, Menu, Wifi } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { MenuSidebar } from "../sidebar/menu";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const cookies = useCookies();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>();

  const handleLogout = () => {
    cookies.remove("profile");
    cookies.remove("accessToken");
    toast.success("Logout successfully");
    router.push("/login");
  };

  useEffect(() => {
    if (cookies.get("profile")) {
      const data = JSON.parse(cookies.get("profile") ?? "");
      setProfileData(data);
    }
  }, [cookies.get("profile")]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-16 shadow-md flex justify-between items-center px-4 gap-4 py-2 flex-none bg-white border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-md xl:hidden" />
          <Link href={"/"}>
            <button
              type="button"
              className="flex items-center leading-none h-10 transition-all rounded-md justify-start"
            >
              <h3 className="w-40 relative aspect-[260/87]">
                <Image src={"/images/liquid8.png"} alt="" fill />
              </h3>
            </button>
          </Link>
        </div>
        <div className="flex gap-4 h-full items-center">
          <Skeleton className="w-28 h-6 rounded-full" />
          <Separator orientation="vertical" />
          <div className="flex items-center text-sm gap-3">
            <Skeleton className="w-7 h-7 rounded-full" />
            <div className="flex flex-col min-w-24 gap-1">
              <Skeleton className="w-16 h-3 rounded-full" />
              <Skeleton className="w-24 h-3 rounded-full" />
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Separator orientation="vertical" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-16 shadow-md flex justify-between items-center px-4 gap-4 py-2 flex-none bg-white border-b">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"outline"} className="xl:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="bg-white overflow-y-scroll w-80 p-0"
            side={"left"}
          >
            <SheetHeader className="px-5 py-3">
              <SheetTitle className="text-lg font-bold text-black flex items-center">
                <Menu className="w-5 h-5 mr-2" />
                Navigation
              </SheetTitle>
            </SheetHeader>
            <MenuSidebar pathname={pathname} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
        <Link href={"/"}>
          <button
            type="button"
            className="flex items-center leading-none h-10 transition-all rounded-md justify-start"
          >
            <h3 className="w-40 relative aspect-[260/87]">
              <Image src={"/images/liquid8.png"} alt="" fill />
            </h3>
          </button>
        </Link>
      </div>
      <div className="flex gap-4 h-full items-center">
        <div>
          <Badge className="bg-sky-500 hover:bg-sky-500 text-white rounded-full gap-2 p-1 pr-2">
            <div className="h-4 w-4 bg-white flex items-center justify-center text-yellow-500 rounded-full">
              <Crown className="w-2.5 h-2.5 fill-yellow-500" />
            </div>
            Superadmin
          </Badge>
        </div>
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
            <p className="capitalize font-semibold leading-none">
              {profileData?.name}
            </p>
            <p className="lowercase text-xs text-gray-500 font-light leading-none">
              {profileData?.email}
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
        <TooltipProviderPage value="Logout" align="end" sideOffset={15}>
          <Button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 p-0 bg-red-100 text-red-500 hover:bg-red-200"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </TooltipProviderPage>
      </div>
    </div>
  );
};

export default Navbar;
