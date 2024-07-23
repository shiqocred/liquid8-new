import { StoreApi, UseBoundStore, create } from "zustand";

export type ModalType =
  | "delete-manifest-inbound"
  | "delete-detail-manifest-inbound"
  | "approve-documents";

interface UseModalProps {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
  data?: any;
}

export const useModal: UseBoundStore<StoreApi<UseModalProps>> =
  create<UseModalProps>((set) => ({
    data: "",
    type: null,
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null }),
  }));
