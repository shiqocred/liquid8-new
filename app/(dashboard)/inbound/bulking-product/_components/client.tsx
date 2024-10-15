"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  RefreshCcw,
  Save,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "../loading";

interface UploadedFileProps {
  file: File;
  name: string;
  size: number;
}

export const Client = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileProps | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeBulk, setTypeBulk] = useState<"category" | "color" | "">("");
  const router = useRouter();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleNext = () => {
    handleComplete();
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        return setSelectedFile({
          file,
          name: file.name,
          size: file.size,
        });
      }
    },
    [accessToken]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1, // Limit file upload to only one
  });

  const handleComplete = async () => {};

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Bulking</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full relative">
        <div className="p-4 bg-white rounded shadow">
          {!selectedFile ? (
            <>
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-bold">Bulking</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="flex gap-2 items-center">
                        <Badge className="bg-black hover:bg-black text-white rounded-full capitalize">
                          <p>{typeBulk}</p>
                          <Separator
                            orientation="vertical"
                            className="h-3 bg-white ml-3 mr-2"
                          />
                          <ChevronDown className="h-4 w-4 stroke-2" />
                        </Badge>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs">
                      <DialogHeader>
                        <DialogTitle>Select a type:</DialogTitle>
                        <DialogDescription>
                          Select a bulking type
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setTypeBulk("category");
                          }}
                          className="justify-start"
                        >
                          <CheckCircle2
                            className={cn(
                              "w-4 h-4 mr-2",
                              typeBulk === "category"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          Category
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setTypeBulk("color");
                          }}
                          className="justify-start"
                        >
                          <CheckCircle2
                            className={cn(
                              "w-4 h-4 mr-2",
                              typeBulk === "color" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Color
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-4">
                  <TooltipProviderPage value="Change File">
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </TooltipProviderPage>
                  <Button className="bg-sky-300/80 hover:bg-sky-300 text-black">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded h-52 flex items-center justify-center text-center cursor-default ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-500">Drop the files here ...</p>
                ) : (
                  <div className="flex justify-center flex-col items-center gap-2">
                    <p>Drag & drop some files here, or click to select files</p>
                    <p className="text-sky-500 text-sm font-semibold">
                      (.xlsx, .xls)
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-4">Selected File</h2>
                <button
                  className="flex text-sm items-center text-gray-500 hover:underline"
                  type="button"
                  onClick={() => setSelectedFile(null)}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Change File
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                <li className="text-sm flex gap-4 px-5 py-3 rounded-md bg-gray-100">
                  <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gradient-to-br from-green-400 to-green-600 text-white">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="font-light text-gray-500 text-xs">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
