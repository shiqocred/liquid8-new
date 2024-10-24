import { ApproveScanResultType } from "@/app/(dashboard)/inbound/check-product/approve-scan-result/_components/_modals/type-modal";
import { CheckProductManifestType } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/type-modal";
import { DetailManifestType } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/type-modal";
import { ManifestInboundType } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/_components/_modals/type-modal";
import { ManualInboundType } from "@/app/(dashboard)/inbound/check-product/manual-inbound/_components/_modals/type-modal";
import { ProductApproveType } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/type-modal";
import { ScanResultProductType } from "@/app/(dashboard)/inbound/check-product/scan-result/[scanResultId]/_components/_modals/type-modal";
import { ScanResultType } from "@/app/(dashboard)/inbound/check-product/scan-result/_components/_modals/type-modal";
import { MovingProductRepairIdType } from "@/app/(dashboard)/inventory/moving-product/repair/[repairId]/_components/_modals/type-modal";
import { MovingProductRepairType } from "@/app/(dashboard)/inventory/moving-product/repair/_components/_modals/type-modal";
import { ListProductRType } from "@/app/(dashboard)/repair-station/list-product-repair/_components/_modals/type-modal";
import { StaggingApproveType } from "@/app/(dashboard)/stagging/approvement/_components/_modals/type-modal";
import { StaggingProductType } from "@/app/(dashboard)/stagging/product/_components/_modals/type-modal";
import { IsroModalType } from "@/lib-isro/type-modal-isro";
import { LusiModalType } from "@/lib-lusi/type-modal-lusi";
import { StoreApi, UseBoundStore, create } from "zustand";

export type ModalType =
  | "delete-detail-manifest-inbound"
  | "approve-documents"
  | DetailManifestType
  | CheckProductManifestType
  | ProductApproveType
  | ManualInboundType
  | ScanResultProductType
  | ApproveScanResultType
  | StaggingProductType
  | ManifestInboundType
  | ScanResultType
  | StaggingApproveType
  | MovingProductRepairIdType
  | MovingProductRepairType
  | ListProductRType
  | IsroModalType
  | LusiModalType;

interface UseModalProps {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
  data?: any;
}

export const useModal: UseBoundStore<StoreApi<UseModalProps>> =
  create<UseModalProps>((set) => ({
    data: null, // Ubah dari "" ke null
    type: null,
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: null }), // Pastikan juga data di-reset ke null saat modal ditutup
  }));
