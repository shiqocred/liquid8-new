"use client";

import React, { useState } from "react";
import { ButtonSidebar } from "../button-sidebar";
import {
  BadgeDollarSign,
  Blocks,
  Boxes,
  Drill,
  FileCog,
  FolderClock,
  Home,
  PackageSearch,
  RailSymbol,
  Recycle,
  ShoppingBasket,
  SwatchBook,
  Truck,
  User,
  Warehouse,
} from "lucide-react";

interface MenuInboundProps {
  pathname: string;
}

const sidebarMenu = [
  {
    id: 1,
    title: "dashboard",
    href: undefined,
    menu: [
      {
        title: "Analystic",
        href: "/dashboard",
        icon: <Home className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 2,
    title: "inbound",
    href: undefined,
    menu: [
      {
        title: "Inbound Process",
        href: "/inbound/inbound-process",
        icon: <FileCog className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "Check Product",
        href: undefined,
        icon: <PackageSearch className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "Manifest Inbound",
            href: "/inbound/check-product/manifest-inbound",
          },
          {
            title: "Approvement Product",
            href: "/inbound/check-product/approvement-product",
          },
          {
            title: "Manual Inbound",
            href: "/inbound/check-product/manual-inbound",
          },
        ],
      },
      {
        title: "Check History",
        href: "/inbound/check-history",
        icon: <FolderClock className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 3,
    title: "inventory",
    href: undefined,
    menu: [
      {
        title: "Product",
        href: undefined,
        icon: <Boxes className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "by category",
            href: "/inventory/product/category",
          },
          {
            title: "by color",
            href: "/inventory/product/color",
          },
        ],
      },
      {
        title: "Category Setting",
        href: undefined,
        icon: <Blocks className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "sub category",
            href: "/inventory/category-setting/sub-category",
          },
          {
            title: "tag color",
            href: "/inventory/category-setting/tag-color",
          },
        ],
      },
      {
        title: "Moving Product",
        href: undefined,
        icon: <RailSymbol className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "bundle",
            href: "/inventory/moving-product/bundle",
          },
          {
            title: "repair",
            href: "/inventory/moving-product/repair",
          },
        ],
      },
      {
        title: "Slow Moving Product",
        href: undefined,
        icon: <Warehouse className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "list product",
            href: "/inventory/slow-moving-product/list-product",
          },
          {
            title: "promo product",
            href: "/inventory/slow-moving-product/promo-product",
          },
        ],
      },
      {
        title: "Pallet",
        href: "/inventory/pallet",
        icon: <SwatchBook className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 4,
    title: "Repair Station",
    href: undefined,
    menu: [
      {
        title: "List Product Repair",
        href: "/repair-station/list-product-repair",
        icon: <Drill className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "QCD",
        href: "/repair-station/qcd",
        icon: <Recycle className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 5,
    title: "outbond",
    href: undefined,
    menu: [
      {
        title: "migrate",
        href: undefined,
        icon: <Truck className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "migrate",
            href: "/outbond/migrate",
          },
          {
            title: "list migrate",
            href: "/outbond/migrate/list",
          },
        ],
      },
      {
        title: "sale",
        href: undefined,
        icon: <ShoppingBasket className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "cashier",
            href: "/outbond/sale",
          },
          {
            title: "list sale",
            href: "/outbond/sale/list",
          },
        ],
      },
      {
        title: "buyer",
        href: "/outbond/buyer",
        icon: <BadgeDollarSign className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 6,
    title: "Account",
    href: undefined,
    menu: [
      {
        title: "Account Setting",
        href: "/account/setting",
        icon: <User className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
];

const MenuInbound = ({ pathname }: MenuInboundProps) => {
  const [openMenu, setOpenMenu] = useState<string>("");
  const [openSubMenu, setOpenSubMenu] = useState<string>("");
  return (
    <div className="flex flex-col h-full w-full gap-1">
      {sidebarMenu.map((item, i) => (
        <div key={item.id} className="flex flex-col gap-1 items-center w-full">
          {item.title !== undefined && (
            <div className="h-10 flex justify-start items-center w-full px-6 bg-sky-600">
              <h3 className="text-sm uppercase font-semibold text-white">
                {item.title}
              </h3>
            </div>
          )}
          <div className="flex flex-col gap-1 w-full px-3">
            {item.menu.map((item, i) => (
              <ButtonSidebar
                key={i}
                label={item.title}
                icon={item.icon}
                href={item.href}
                pathname={pathname}
                sidebarMenu={sidebarMenu}
                subMenu={item.sub_menu}
                setOpenMenu={setOpenMenu}
                openMenu={openMenu}
                setOpenSubMenu={setOpenSubMenu}
                openSubMenu={openSubMenu}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuInbound;
