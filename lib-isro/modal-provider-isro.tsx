import { CreateEditAccountModal } from "@/app/(dashboard)/account/setting/_components/_modals/create-edit-account-modal";
import { DeleteAccountModal } from "@/app/(dashboard)/account/setting/_components/_modals/delete-account-modal";
import { CreateEditBuyerModal } from "@/app/(dashboard)/outbond/buyer/_components/_modals/create-edit-buyer-modal";
import { DeleteBuyerModal } from "@/app/(dashboard)/outbond/buyer/_components/_modals/delete-buyer-modal";
import { CreateEditDestinationModal } from "@/app/(dashboard)/outbond/destination/_components/_modals/create-edit-destination-modal";
import { DeleteDestinationModal } from "@/app/(dashboard)/outbond/destination/_components/_modals/delete-destination-modal";
import { RemoveProductCreateMigrateModal } from "@/app/(dashboard)/outbond/migrate/create/_components/_modals/remove-product-create-migrate-modal";
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
      <RemoveProductCreateMigrateModal />
      <CreateEditDestinationModal />
      <DeleteDestinationModal />
      <CreateEditBuyerModal />
      <DeleteBuyerModal />
      <CreateEditAccountModal />
      <DeleteAccountModal />
    </>
  );
};
