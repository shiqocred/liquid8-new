import React, { FormEvent } from "react";
import { Modal } from "../modal";
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";

const DeleteManifestInboundModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "delete-manifest-inbound";

  const onDelete = async (e: FormEvent) => {};

  return (
    <Modal
      title="Delete Manifest Inbound"
      description="This is a Permanent action"
      isOpen={isModalOpen}
      onClose={onClose}
    >
      <div className="w-full flex flex-col gap-4">
        <p>Are you sure to delete this data?</p>
        <div className="flex w-full gap-2">
          <Button
            className="w-full bg-transparent hover:bg-transparent text-black border-black/50 border hover:border-black"
            onClick={onClose}
            type="button"
          >
            Disgard
          </Button>
          <Button variant={"destructive"} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteManifestInboundModal;
