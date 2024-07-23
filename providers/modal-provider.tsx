"use client";

import ApprovementProductsModal from "@/components/modal/approve-product-modal";
import DeleteDetailManifestInboundModal from "@/components/modal/delete-detail-manifest-inbound-modal";
import DeleteManifestInboundModal from "@/components/modal/delete-manifest-inbound-modal";

const ModalProvider = () => {
  return (
    <>
      <DeleteManifestInboundModal />
      <DeleteDetailManifestInboundModal />
      <ApprovementProductsModal />
    </>
  );
};

export default ModalProvider;
