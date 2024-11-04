import { AccountType } from "@/app/(dashboard)/account/setting/_components/_modals/type-modal";
import { BuyerType } from "@/app/(dashboard)/outbond/buyer/_components/_modals/type-modal";
import { DestinationType } from "@/app/(dashboard)/outbond/destination/_components/_modals/type-modal";
import { MigrateIdType } from "@/app/(dashboard)/outbond/migrate/create/_components/_modals/type-modal";
import { createQCDType } from "@/app/(dashboard)/repair-station/qcd/[qcdId]/_components/_modals/type-modal";
import { ListQCDType } from "@/app/(dashboard)/repair-station/qcd/_components/_modals/type-modal";

export type IsroModalType =
  | ListQCDType
  | createQCDType
  | MigrateIdType
  | DestinationType
  | BuyerType
  | AccountType;
