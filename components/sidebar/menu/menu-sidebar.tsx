"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { ButtonSidebar } from "../button-sidebar";
import {
  BadgeDollarSign,
  BarChartBig,
  BarChartBigIcon,
  Blocks,
  Boxes,
  CandlestickChart,
  Drill,
  FileCog,
  FolderClock,
  Home,
  Layers3,
  LineChart,
  MapPinned,
  PackageSearch,
  RailSymbol,
  Recycle,
  ShoppingBasket,
  SquareLibrary,
  SwatchBook,
  Target,
  Truck,
  User,
  Warehouse,
} from "lucide-react";

interface MenuInboundProps {
  pathname: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const sidebarMenu = [
  {
    id: 1,
    title: "dashboard",
    href: undefined,
    menu: [
      {
        title: "Storage Report",
        href: "/dashboard/storage-report",
        icon: <LineChart className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "General Sale",
        href: "/dashboard/general-sale",
        icon: <BarChartBig className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "Analytic Sale",
        href: "/dashboard/analytic-sale",
        icon: <CandlestickChart className="w-5 h-5 stroke-[1.5]" />,
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
        title: "Bulking Product",
        href: undefined,
        icon: <Target className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [
          {
            title: "Bulking Category",
            href: "/inbound/bulking-product/category",
          },
          {
            title: "Bulking Color",
            href: "/inbound/bulking-product/color",
          },
        ],
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
            title: "Product Approve",
            href: "/inbound/check-product/product-approve",
          },
          {
            title: "Approvement Document",
            href: "/inbound/check-product/approvement-document",
          },
          {
            title: "Manual Inbound",
            href: "/inbound/check-product/manual-inbound",
          },
          {
            title: "Scan Result",
            href: "/inbound/check-product/scan-result",
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
    title: "Stagging",
    href: undefined,
    menu: [
      {
        title: "Product Stagging",
        href: "/stagging/product",
        icon: <Layers3 className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "Approvement Stagging",
        href: "/stagging/approvement",
        icon: <SquareLibrary className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
    ],
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    title: "outbond",
    href: undefined,
    menu: [
      {
        title: "migrate",
        href: "/outbond/migrate",
        icon: <Truck className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "destination",
        href: "/outbond/destination",
        icon: <MapPinned className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
      },
      {
        title: "sale",
        href: "/outbond/sale",
        icon: <ShoppingBasket className="w-5 h-5 stroke-[1.5]" />,
        sub_menu: [],
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
    id: 7,
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

const MenuInbound = ({ pathname, setOpen }: MenuInboundProps) => {
  const [openMenu, setOpenMenu] = useState<string>("");
  const [openSubMenu, setOpenSubMenu] = useState<string>("");
  return (
    <div className="flex flex-col h-full w-full gap-1">
      {sidebarMenu.map((item, i) => (
        <div
          key={item.id}
          className="flex flex-col gap-1 items-center w-full last:pb-20"
        >
          {item.title !== undefined && (
            <div className="h-10 flex justify-start items-center w-full px-6 bg-sky-300/70">
              <h3 className="text-sm uppercase font-semibold text-sky-900">
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
                setOpen={setOpen}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuInbound;
