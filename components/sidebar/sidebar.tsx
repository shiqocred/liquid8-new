"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MenuSidebar } from "./menu";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-sky-500 w-80 h-full overflow-y-scroll shadow-md">
      <MenuSidebar pathname={pathname} />
    </div>
  );
};
