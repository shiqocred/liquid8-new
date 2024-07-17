"use client";

import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SidebarButtonProps {
  label: string;
  href: string | undefined;
  icon: ReactNode;
  sidebarMenu: any[];
  subMenu?: any[];
  pathname: string;
  setOpenMenu: Dispatch<SetStateAction<string>>;
  openMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  openSubMenu: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const ButtonSidebar = ({
  label,
  href,
  icon,
  sidebarMenu,
  subMenu,
  pathname,
  openMenu,
  setOpenMenu,
  setOpenSubMenu,
  openSubMenu,
  setOpen,
}: SidebarButtonProps) => {
  // button width variant
  const buttonChevronVariant = {
    isClose: { rotate: "0deg" },
    isOpen: { rotate: "90deg" },
  };

  const findActiveMenuTitle = () => {
    for (const menu of sidebarMenu) {
      for (const item of menu.menu) {
        // Check direct href match
        if (menu.href && pathname.includes(menu.href)) {
          return menu.title;
        }
        // Check sub_menu href match
        for (const subItem of item.sub_menu) {
          if (subItem.href && pathname.includes(subItem.href)) {
            return item.title;
          }
        }
      }
    }
    return null;
  };
  const findActiveSubMenuTitle = () => {
    for (const menu of sidebarMenu) {
      for (const item of menu.menu) {
        for (const subItem of item.sub_menu) {
          if (subItem.href && pathname.includes(subItem.href)) {
            return subItem.title;
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    // Function to find the active menu title
    setOpenMenu(findActiveMenuTitle());
    // Function to find the active menu title
    setOpenSubMenu(findActiveSubMenuTitle());
  }, [pathname]);
  return (
    <div className="w-full">
      {href ? (
        <Link href={href}>
          <button
            type="button"
            className={cn(
              "flex items-center leading-none h-10 bg-transparent hover:bg-sky-600/70 dark:hover:bg-gray-700 px-3 transition-all text-sm font-medium rounded-md justify-between w-full",
              pathname.includes(href) && "bg-sky-600/70 hover:bg-sky-600"
            )}
            onClick={() => setOpen?.(false)}
          >
            <div className="flex gap-2 items-center w-full capitalize text-white">
              <span className="w-5 h-5 text-sky-200">{icon}</span>
              <span>{label}</span>
            </div>
          </button>
        </Link>
      ) : (
        <>
          <button
            type="button"
            className={cn(
              "flex items-center leading-none h-10 bg-transparent hover:bg-sky-600/70 dark:hover:bg-gray-700 px-3 transition-all text-sm font-medium rounded-md justify-between w-full",
              (openMenu === label || findActiveMenuTitle() === label) &&
                "bg-sky-600/70 hover:bg-sky-600"
            )}
            onClick={() =>
              label === openMenu ? setOpenMenu("") : setOpenMenu(label)
            }
          >
            <div className="flex gap-2 items-center w-full capitalize text-white">
              <span className="w-5 h-5 text-sky-200">{icon}</span>
              <span>{label}</span>
            </div>
            <motion.span
              initial="isClose"
              animate={openMenu === label ? "isOpen" : "isClose"}
              variants={buttonChevronVariant}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </motion.span>
          </button>
          {subMenu && subMenu?.length > 0 && (
            <AnimatePresence>
              {openMenu === label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col items-start mt-1"
                >
                  {subMenu.map((item) => (
                    <Link href={item.href} className="w-full" key={item.href}>
                      <button
                        className={cn(
                          "flex items-center leading-none capitalize h-10 text-white bg-transparent hover:bg-sky-600/70 dark:hover:bg-gray-700 pl-6 pr-3 transition-all text-sm font-light rounded-md justify-between w-full",
                          (pathname === item.href ||
                            openSubMenu === item.title) &&
                            "text-black"
                        )}
                        type="button"
                        onClick={() => setOpen?.(false)}
                      >
                        - {item.title}
                      </button>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
};
