import { BarcodePrinteredLPRModal } from "@/app/(dashboard)/repair-station/list-product-repair/_components/_modals/barcode-printered-lpr-modal";
import { ToDisplayLPRModal } from "@/app/(dashboard)/repair-station/list-product-repair/_components/_modals/to-display-lpr-modal";
import { BarcodePrinteredQCDDetailModal } from "@/app/(dashboard)/repair-station/qcd/[qcdId]/_components/_modals/barcode-printered-qcd-detail-modal";
import { DeleteQCDBundleModal } from "@/app/(dashboard)/repair-station/qcd/[qcdId]/_components/_modals/delete-qcd-bundle-modal";
import { ScrapProductCreateQCDModal } from "@/app/(dashboard)/repair-station/qcd/[qcdId]/_components/_modals/scrap-product-create-qcd-modal";
import { DestroyQCDModal } from "@/app/(dashboard)/repair-station/qcd/_components/_modals/destroy-qcd-modal";
import { UnbundleQCDModal } from "@/app/(dashboard)/repair-station/qcd/_components/_modals/unbundle-qcd-modal";

export const ModalProviderIsro = () => {
  return (
    <>
      <UnbundleQCDModal />
      <DestroyQCDModal />
      <ScrapProductCreateQCDModal />
      <BarcodePrinteredQCDDetailModal />
      <DeleteQCDBundleModal />
      <ToDisplayLPRModal />
      <BarcodePrinteredLPRModal />
    </>
  );
};
