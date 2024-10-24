"use client";

import { DeleteProductApproveScanResultModal } from "@/app/(dashboard)/inbound/check-product/approve-scan-result/_components/_modals/delete-product-approve-scan-result-modal";
import { DetailProductApproveScanResultModal } from "@/app/(dashboard)/inbound/check-product/approve-scan-result/_components/_modals/detail-product-approve-scan-result-modal";
import { DoneCheckAllApproveScanResultModal } from "@/app/(dashboard)/inbound/check-product/approve-scan-result/_components/_modals/done-check-all-approve-scan-result-modal";
import { BarcodePrinteredCheckProductManualInboundModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/barcode-printered-check-product-manual-inbound-modal";
import { DoubleBarcodeManifestInboundModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/check/_components/_modals/double-barcode-manifest-inbound-modal";
import { CustomBarcodeModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/custom-barcode-modal";
import { DeleteCustomBarcodeModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/[manifestInboundId]/[manifestInboundMonth]/[manifestInboundYear]/detail/_components/_modals/delete-custom-barcode-modal";
import { DeleteManifestInboundModal } from "@/app/(dashboard)/inbound/check-product/manifest-inbound/_components/_modals/delete-manifest-inbound-modal";
import { BarcodePrinteredCheckProductManifestInboundModal } from "@/app/(dashboard)/inbound/check-product/manual-inbound/_components/_modals/barcode-printered-check-product-manifest-inbound-modal";
import { DeleteProductApproveModal } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/delete-product-approve-modal";
import { DeleteProductDetailProductApproveModal } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/delete-product-detail-product-approve-modal";
import { DetailProductDetailProductApproveModal } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/detail-product-detail-product-approve-modal";
import { StaggingProductApproveModal } from "@/app/(dashboard)/inbound/check-product/product-approve/_components/_modals/staging-product-approve-modal";
import { ParcodePrinteredCheckProductScanResultModal } from "@/app/(dashboard)/inbound/check-product/scan-result/[scanResultId]/_components/_modals/barcode-printered-check-product-scan-result-modal";
import { DeleteScanResultModal } from "@/app/(dashboard)/inbound/check-product/scan-result/_components/_modals/delete-scan-result-modal";
import { BarcodePrinteredMovingProductDetailRepair } from "@/app/(dashboard)/inventory/moving-product/repair/[repairId]/_components/_modals/barcode-printered-moving-product-detail-repair-modal";
import { RemoveMovingProductListDetailRepairModal } from "@/app/(dashboard)/inventory/moving-product/repair/[repairId]/_components/_modals/remove-moving-product-list-detail-repair-modal";
import { DeleteMovingProductRepairModal } from "@/app/(dashboard)/inventory/moving-product/repair/_components/_modals/delete-moving-product-repair-modal";
import { DeleteProductStaggingApproveModal } from "@/app/(dashboard)/stagging/approvement/_components/_modals/delete-product-stagging-approve-modal";
import { DetailProductStaggingApproveModal } from "@/app/(dashboard)/stagging/approvement/_components/_modals/detail-product-stagging-approve-modal";
import { DoneCheckAllStaggingApproveModal } from "@/app/(dashboard)/stagging/approvement/_components/_modals/done-check-all-stagging-approve-modal";
import { DoneCheckAllStaggingProductModal } from "@/app/(dashboard)/stagging/product/_components/_modals/done-check-all-stagging-product-modal";
import ApprovementProductsModal from "@/components/modal/approve-product-modal";
import DeleteDetailManifestInboundModal from "@/components/modal/delete-detail-manifest-inbound-modal";

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
      <DeleteProductDetailProductApproveModal />
      <DetailProductDetailProductApproveModal />
      <DeleteProductApproveModal />
      <StaggingProductApproveModal />
      <BarcodePrinteredCheckProductManualInboundModal />
      <ParcodePrinteredCheckProductScanResultModal />
      <DeleteProductApproveScanResultModal />
      <DetailProductApproveScanResultModal />
      <DoneCheckAllApproveScanResultModal />
      <DeleteProductStaggingApproveModal />
      <DetailProductStaggingApproveModal />
      <DoneCheckAllStaggingApproveModal />
      <DoneCheckAllStaggingProductModal />
      <DeleteScanResultModal />
      <RemoveMovingProductListDetailRepairModal />
      <DeleteMovingProductRepairModal />
      <BarcodePrinteredMovingProductDetailRepair />
    </>
  );
};

export default ModalProvider;
