import { AccountType } from "@/app/(dashboard)/account/setting/_components/_modals/type-modal";
import { SubCategoryType } from "@/app/(dashboard)/inventory/category-setting/sub-category/_components/_modals/type-modal";
import { TagColorType } from "@/app/(dashboard)/inventory/category-setting/tag-color/_components/_modals/type-modal";
import { BundleIdType } from "@/app/(dashboard)/inventory/moving-product/bundle/[bundleId]/_components/_modals/type-modal";
import { BundleType } from "@/app/(dashboard)/inventory/moving-product/bundle/_components/_modals/type-modal";
import { ListProductMVType } from "@/app/(dashboard)/inventory/slow-moving-product/list-product/_components/_modals/type-modal";
import { BuyerType } from "@/app/(dashboard)/outbond/buyer/_components/_modals/type-modal";
import { DestinationType } from "@/app/(dashboard)/outbond/destination/_components/_modals/type-modal";
import { MigrateIdType } from "@/app/(dashboard)/outbond/migrate/create/_components/_modals/type-modal";
import { SaleIdType } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/type-modal";
import { createQCDType } from "@/app/(dashboard)/repair-station/qcd/[qcdId]/_components/_modals/type-modal";
import { ListQCDType } from "@/app/(dashboard)/repair-station/qcd/_components/_modals/type-modal";

export type IsroModalType =
  | ListQCDType
  | createQCDType
  | MigrateIdType
  | DestinationType
  | BuyerType
  | AccountType
  | SaleIdType
  | SubCategoryType
  | TagColorType
  | BundleIdType
  | BundleType
  | ListProductMVType;
