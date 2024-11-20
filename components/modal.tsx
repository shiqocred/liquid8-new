"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  description: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  rightPanel?: ReactNode;
}

export const Modal = ({
  title,
  description,
  children,
  isOpen,
  onClose,
  className,
  rightPanel,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={className}>
        <DialogHeader
          className={cn(
            "flex items-center flex-row",
            rightPanel ? "justify-between w-full" : "justify-start"
          )}
        >
          <div className="flex flex-col">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          {rightPanel}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
