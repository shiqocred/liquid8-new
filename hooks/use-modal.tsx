import { CheckProductManifestType } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/type-modal";
import { DetailManifestType } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/type-modal";
import { ProductApproveType } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/type-modal";
import { StoreApi, UseBoundStore, create } from "zustand";

export type ModalType =
  | "delete-manifest-inbound"
  | "delete-detail-manifest-inbound"
  | "approve-documents"
  | DetailManifestType
  | CheckProductManifestType
  | ProductApproveType;

interface UseModalProps {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
  data?: any;
}

// export const useModal: UseBoundStore<StoreApi<UseModalProps>> =
//   create<UseModalProps>((set) => ({
//     data: "",
//     type: null,
//     isOpen: false,
//     onOpen: (type, data) => set({ isOpen: true, type, data }),
//     onClose: () => set({ isOpen: false, type: null }),
//   }));

export const useModal: UseBoundStore<StoreApi<UseModalProps>> =
  create<UseModalProps>((set) => ({
    data: null, // Ubah dari "" ke null
    type: null,
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: null }), // Pastikan juga data di-reset ke null saat modal ditutup
  }));
