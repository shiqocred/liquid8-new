import { CreateEditAccountModal } from "@/app/(dashboard)/account/setting/_components/_modals/create-edit-account-modal";
import { DeleteAccountModal } from "@/app/(dashboard)/account/setting/_components/_modals/delete-account-modal";
import { CreateEditCategoryModal } from "@/app/(dashboard)/inventory/category-setting/sub-category/_components/_modals/create-edit-category-modal";
import { DeleteCategoryModal } from "@/app/(dashboard)/inventory/category-setting/sub-category/_components/_modals/delete-category-modal";
import { CreateEditColorModal } from "@/app/(dashboard)/inventory/category-setting/tag-color/_components/_modals/create-edit-color-modal";
import { DeleteColorModal } from "@/app/(dashboard)/inventory/category-setting/tag-color/_components/_modals/delete-color-modal";
import { BarcodePrinteredBundleDetailModal } from "@/app/(dashboard)/inventory/moving-product/bundle/[bundleId]/_components/_modals/barcode-printered-bundle-detail-modal";
import { DeleteProductBundleModal } from "@/app/(dashboard)/inventory/moving-product/bundle/[bundleId]/_components/_modals/remove-product-bundle-modal";
import { DestroyBundleModal } from "@/app/(dashboard)/inventory/moving-product/bundle/_components/_modals/destroy-bundle-modal";
import { CreateEditBrandPaletModal } from "@/app/(dashboard)/inventory/pallet/brand/_components/_modals/create-edit-brand-palet-modal";
import { DeleteBrandPaletModal } from "@/app/(dashboard)/inventory/pallet/brand/_components/_modals/delete-brand-palet-modal";
import { CreateEditConditionPaletModal } from "@/app/(dashboard)/inventory/pallet/condition/_components/_modals/create-edit-condition-palet-modal";
import { DeleteConditionPaletModal } from "@/app/(dashboard)/inventory/pallet/condition/_components/_modals/delete-condition-palet-modal";
import { CreateEditStatusPaletModal } from "@/app/(dashboard)/inventory/pallet/status/_components/_modals/create-edit-status-palet-modal";
import { DeleteStatusPaletModal } from "@/app/(dashboard)/inventory/pallet/status/_components/_modals/delete-status-palet-modal";
import { CreateEditTransportationPaletModal } from "@/app/(dashboard)/inventory/pallet/transportation/_components/_modals/create-edit-transportation-palet-modal";
import { DeleteTransportationPaletModal } from "@/app/(dashboard)/inventory/pallet/transportation/_components/_modals/delete-transportation-palet-modal";
import { CreateEditWarehousePaletModal } from "@/app/(dashboard)/inventory/pallet/warehouse/_components/_modals/create-edit-warehouse-palet-modal";
import { DeleteWarehousePaletModal } from "@/app/(dashboard)/inventory/pallet/warehouse/_components/_modals/delete-warehouse-palet-modal";
import { DoneCheckAllBKLModal } from "@/app/(dashboard)/inventory/slow-moving-product/bkl/create/_components/_modals/done-check-all-bkl-modal";
import { DeleteListProductSMVModal } from "@/app/(dashboard)/inventory/slow-moving-product/list-product/_components/_modals/delete-list-product-smv-modal";
import { DetailListProductSMVModal } from "@/app/(dashboard)/inventory/slow-moving-product/list-product/_components/_modals/detail-list-product-smv-modal";
import { DetailPromoModal } from "@/app/(dashboard)/inventory/slow-moving-product/promo-product/_components/_modals/detail-promo-modal";
import { CreateEditBuyerModal } from "@/app/(dashboard)/outbond/buyer/_components/_modals/create-edit-buyer-modal";
import { DeleteBuyerModal } from "@/app/(dashboard)/outbond/buyer/_components/_modals/delete-buyer-modal";
import { CreateEditDestinationModal } from "@/app/(dashboard)/outbond/migrate-color/destination/_components/_modals/create-edit-destination-modal";
import { DeleteDestinationModal } from "@/app/(dashboard)/outbond/migrate-color/destination/_components/_modals/delete-destination-modal";
import { RemoveProductCreateMigrateModal } from "@/app/(dashboard)/outbond/migrate-color/list/create/_components/_modals/remove-product-create-migrate-modal";
import { DeleteProductSaleModal } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/delete-product-sale-modal";
import { GaborProductSaleModal } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/gabor-product-sale-modal";
import { PriceProductSaleModal } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/price-product-sale-modal";
import { PrintDataSaleModal } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/print-data-sale-modal";
import { PrintProductSaleModal } from "@/app/(dashboard)/outbond/sale/[saleId]/_components/_modals/print-product-sale-modal";
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
      <DeleteProductSaleModal />
      <GaborProductSaleModal />
      <PriceProductSaleModal />
      <PrintDataSaleModal />
      <PrintProductSaleModal />
      <CreateEditCategoryModal />
      <DeleteCategoryModal />
      <CreateEditColorModal />
      <DeleteColorModal />
      <DestroyBundleModal />
      <BarcodePrinteredBundleDetailModal />
      <DeleteProductBundleModal />
      <DetailListProductSMVModal />
      <DeleteListProductSMVModal />
      <DetailPromoModal />
      <DoneCheckAllBKLModal />
      <DeleteWarehousePaletModal />
      <CreateEditWarehousePaletModal />
      <CreateEditConditionPaletModal />
      <DeleteConditionPaletModal />
      <CreateEditStatusPaletModal />
      <DeleteStatusPaletModal />
      <CreateEditBrandPaletModal />
      <DeleteBrandPaletModal />
      <CreateEditTransportationPaletModal />
      <DeleteTransportationPaletModal />
    </>
  );
};
