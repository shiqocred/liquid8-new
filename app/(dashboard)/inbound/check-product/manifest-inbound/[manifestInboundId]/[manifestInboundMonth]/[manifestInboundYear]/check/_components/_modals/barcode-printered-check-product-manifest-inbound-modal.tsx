"use client";

import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import BarcodePrinted from "@/components/barcode";

export const BarcodePrinteredCheckProductManifestInboundModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [input, setInput] = useState("");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const isModalOpen = isOpen && type === "manifest-inbound-barcode-printered";

  return (
    <Modal
      title="Barcode Printered"
      description=""
      isOpen={isModalOpen}
      onClose={onClose}
      className="w-fit"
    >
      <BarcodePrinted
        oldPrice={data?.oldPrice ?? "0"}
        barcode={data?.barcode ?? ""}
        category={data?.category ?? ""}
        newPrice={data?.newPrice ?? "0"}
        cancel={onClose}
      />
    </Modal>
  );
};
