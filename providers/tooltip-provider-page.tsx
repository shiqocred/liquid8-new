import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { ReactNode } from "react";

export const TooltipProviderPage = ({
  children,
  value,
  className,
  sideOffset,
}: {
  className?: string;
  sideOffset?: number;
  children: ReactNode;
  value: ReactNode;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className} sideOffset={sideOffset}>
          {value}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
