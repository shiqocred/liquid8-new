"use client";

import { BarcodePrinteredCheckProductManifestInboundModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/barcode-printered-check-product-manifest-inbound-modal";
import { DoubleBarcodeManifestInboundModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/double-barcode-manifest-inbound-modal";
import { CustomBarcodeModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/custom-barcode-modal";
import { DeleteCustomBarcodeModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/delete-custom-barcode-modal";
import ApprovementProductsModal from "@/components/modal/approve-product-modal";
import DeleteDetailManifestInboundModal from "@/components/modal/delete-detail-manifest-inbound-modal";
import DeleteManifestInboundModal from "@/components/modal/delete-manifest-inbound-modal";

const ModalProvider = () => {
  return (
    <>
      <DeleteManifestInboundModal />
      <DeleteDetailManifestInboundModal />
      <ApprovementProductsModal />
      <CustomBarcodeModal />
      <DeleteCustomBarcodeModal />
      <BarcodePrinteredCheckProductManifestInboundModal />
      <DoubleBarcodeManifestInboundModal />
    </>
  );
};

export default ModalProvider;
