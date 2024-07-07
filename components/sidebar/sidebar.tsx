"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MenuAtas, MenuSidebar } from "./menu";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-gray-500 border-r relative w-80">
      <MenuAtas />
      <MenuSidebar pathname={pathname} />
    </div>
  );
};
