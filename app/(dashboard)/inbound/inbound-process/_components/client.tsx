"use client";

import {
  Ban,
  Gem,
  Disc,
  Save,
  Check,
  Barcode,
  ArrowLeft,
  ArrowRight,
  FolderEdit,
  RefreshCcw,
  MoreHorizontal,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useCookies } from "next-client-cookies";

import Loading from "../loading";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import Link from "next/link";

interface UploadedFileProps {
  file: File;
  name: string;
  size: number;
}

const steps = ["Step 1", "Step 2"];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export const Client = () => {
  // state boolean
  const [isMounted, setIsMounted] = useState(false);

  // slide core
  const [direction, setDirection] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // state data
  const [selectedFile, setSelectedFile] = useState<UploadedFileProps | null>(
    null
  );
  const [results, setResults] = useState<any>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [selected, setSelected] = useState({
    barcode: "",
    name: "",
    qty: "",
    price: "",
  });

  // core
  const router = useRouter();

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // handle slide
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      handleUpload();
    } else {
      handleComplete();
    }
  };

  // handle upload file
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
      });
    }
  };

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

  const handleUpload = async () => {
    const formData = new FormData();
    if (selectedFile?.file) {
      formData.append("file", selectedFile.file);
    }

    try {
      const res = await axios.post(`${baseUrl}/generate`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setResults(res.data.data.resource);
      setHeaders(res.data.data.resource.headers);
      toast.success("File Uploaded");
    } catch (error: any) {
      toast.error(`Error ${error.response.status}: failed to upload file`);
      console.log("ERROR_GENERATE_FILE:", error);
    }
  };

  // handle merge
  const handleComplete = async () => {
    if (
      !results ||
      !selected.barcode ||
      !selected.name ||
      !selected.price ||
      !selected.qty
    )
      return;

    const payload = {
      code_document: results.code_document,
      headerMappings: {
        old_barcode_product: [selected.barcode],
        old_name_product: [selected.name],
        old_quantity_product: [selected.qty],
        old_price_product: [selected.price],
      },
    };

    try {
      const res = await axios.post(
        `${baseUrl}/generate/merge-headers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("File successfully merged");
      router.push("/inbound/check-product/manifest-inbound");
    } catch (error: any) {
      toast.error(`Error ${error.response.status}: failed to merge file`);
      console.log("ERROR_MERGE_FILE:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 w-full relative px-4 gap-4 py-4">
      <div className="grid grid-cols-4 w-full bg-white rounded-md overflow-hidden shadow">
        <div className="flex border-r px-4 items-center gap-4 w-full h-20">
          {selectedFile ? (
            <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-green-100 text-green-500">
              <Check className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </div>
          )}
          <div className="flex flex-col">
            <h5 className="font-medium capitalize">upload file</h5>
            <p
              className={cn(
                "text-xs",
                selectedFile ? "text-green-500" : "text-gray-400"
              )}
            >
              {selectedFile ? "completed" : "current"}
            </p>
          </div>
        </div>
        <div className="flex border-r px-4 items-center gap-4 w-full h-20">
          <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gray-100">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h5 className="font-medium capitalize">pick header</h5>
            <p className="text-xs text-gray-400">
              {currentStep === 1 ? "current" : "not complete"}
            </p>
          </div>
        </div>
        <button
          onClick={handleNext}
          className={cn(
            "border-r px-4 items-center w-full h-20 hover:gap-4 gap-2 group transition-all flex disabled:cursor-not-allowed col-span-2"
          )}
          disabled={
            (!selectedFile && currentStep === 0) ||
            (currentStep === steps.length - 1 &&
              (!selected.barcode ||
                !selected.name ||
                !selected.price ||
                !selected.qty))
          }
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center  transition-all",
              (!selectedFile && currentStep === 0) ||
                (currentStep === steps.length - 1 &&
                  (!selected.barcode ||
                    !selected.name ||
                    !selected.price ||
                    !selected.qty))
                ? "group-hover:bg-gray-100"
                : "group-hover:bg-green-300"
            )}
          >
            {currentStep === steps.length - 1 ? (
              <>
                {selected.barcode &&
                selected.name &&
                selected.price &&
                selected.qty ? (
                  <Save className="w-5 h-5" />
                ) : (
                  <Ban className="w-5 h-5" />
                )}
              </>
            ) : (
              <>
                {selectedFile ? (
                  <ArrowRight className="w-5 h-5" />
                ) : (
                  <Ban className="w-5 h-5" />
                )}
              </>
            )}
          </div>
          <div className="flex flex-col items-start">
            <h5 className="font-medium capitalize">
              {currentStep === steps.length - 1 ? "completed" : "next"}
            </h5>
            {!selectedFile && (
              <p className="px-2 rounded bg-red-100 text-xs">
                Upload file, please!
              </p>
            )}
          </div>
        </button>
      </div>
      <div className="w-full bg-yellow-200 px-5 py-3 rounded-md flex items-center shadow">
        <AlertCircle className="w-4 h-4 mr-2" />
        <p className="text-sm">
          Please complete until the headers selection is complete first, if you
          experience failure in the process please delete the uploaded file
          <Link
            href={"/inbound/check-product/manifest-inbound"}
            className="mx-1 underline font-semibold"
          >
            here
          </Link>
          first.
        </p>
      </div>
      <div className="w-full relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {currentStep === 0 && (
              <div className="p-4 bg-white rounded shadow">
                {!selectedFile ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Add new files</h2>
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
                          <p>
                            Drag & drop some files here, or click to select
                            files
                          </p>
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
            )}
            {currentStep === 1 && (
              <div className="p-4 bg-white rounded shadow flex flex-col gap-6">
                <h2 className="text-xl font-bold">Pick Header</h2>
                <div className="w-full flex flex-col border rounded border-gray-500 p-3">
                  <div className="flex items-center text-sm font-semibold border-b border-gray-500 pb-3">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    <div className="flex w-full items-center justify-between">
                      <p>Uploaded File</p>
                      <Badge className="bg-gray-200 hover:bg-gray-200 border border-black rounded-full text-black">
                        {results?.code_document}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3 border-b py-5 border-gray-500">
                    <div className="flex flex-col pl-6 w-full overflow-hidden gap-1">
                      <p className="text-xs font-medium">File Name</p>
                      <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {results?.file_name}
                      </p>
                    </div>
                    <div className="w-1/3 flex-none pl-6 flex gap-2 ">
                      <div className="flex flex-col w-2/3 overflow-hidden gap-1">
                        <p className="text-xs font-medium">Total Columns</p>
                        <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {results?.fileDetails.total_column_count}
                        </p>
                      </div>
                      <div className="flex flex-col w-1/3 overflow-hidden gap-1">
                        <p className="text-xs font-medium">Total Row</p>
                        <p className="text-sm text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {results?.fileDetails.total_row_count}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="w-full flex justify-center mt-2 flex-col items-start">
                      <p className="text-sm py-3 font-semibold flex items-center">
                        <div className="w-8 h-8 rounded-full border flex justify-center items-center mr-2 border-black">
                          <Barcode className="w-4 h-4" />
                        </div>
                        Barcode
                      </p>
                      <RadioGroup
                        value={selected.barcode}
                        onValueChange={(e) =>
                          setSelected((prev) => ({ ...prev, barcode: e }))
                        }
                        className="flex w-full flex-col p-1 border border-gray-500 rounded-md border-dashed"
                      >
                        {headers.map((item) => (
                          <Label
                            key={item + "barcode"}
                            htmlFor={item + "barcode"}
                            className={cn(
                              "flex w-full px-5 py-2 gap-2 items-center rounded hover:bg-sky-100",
                              selected.barcode === item &&
                                "bg-sky-100 hover:bg-sky-200"
                            )}
                          >
                            <RadioGroupItem
                              value={item}
                              id={item + "barcode"}
                            />
                            <p>{item}</p>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="w-full flex justify-center mt-2 flex-col items-start border-l ml-3 pl-3 border-gray-500">
                      <p className="text-sm py-3 font-semibold flex items-center">
                        <div className="w-8 h-8 rounded-full border flex justify-center items-center mr-2 border-black">
                          <FolderEdit className="w-4 h-4" />
                        </div>
                        Product Name
                      </p>
                      <RadioGroup
                        value={selected.name}
                        onValueChange={(e) =>
                          setSelected((prev) => ({ ...prev, name: e }))
                        }
                        className="flex w-full flex-col p-1 border border-gray-500 rounded-md border-dashed"
                      >
                        {headers.map((item) => (
                          <Label
                            key={item + "name"}
                            htmlFor={item + "name"}
                            className={cn(
                              "flex w-full px-5 py-2 gap-2 items-center rounded hover:bg-sky-100",
                              selected.name === item &&
                                "bg-sky-100 hover:bg-sky-200"
                            )}
                          >
                            <RadioGroupItem value={item} id={item + "name"} />
                            <p>{item}</p>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="w-full flex justify-center mt-2 flex-col items-start border-l ml-3 pl-3 border-gray-500">
                      <p className="text-sm py-3 font-semibold flex items-center">
                        <div className="w-8 h-8 rounded-full border flex justify-center items-center mr-2 border-black">
                          <Disc className="w-4 h-4" />
                        </div>
                        Qty
                      </p>
                      <RadioGroup
                        value={selected.qty}
                        onValueChange={(e) =>
                          setSelected((prev) => ({ ...prev, qty: e }))
                        }
                        className="flex w-full flex-col p-1 border border-gray-500 rounded-md border-dashed"
                      >
                        {headers.map((item) => (
                          <Label
                            key={item + "qty"}
                            htmlFor={item + "qty"}
                            className={cn(
                              "flex w-full px-5 py-2 gap-2 items-center rounded hover:bg-sky-100",
                              selected.qty === item &&
                                "bg-sky-100 hover:bg-sky-200"
                            )}
                          >
                            <RadioGroupItem value={item} id={item + "qty"} />
                            <p>{item}</p>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="w-full flex justify-center mt-2 flex-col items-start border-l ml-3 pl-3 border-gray-500">
                      <p className="text-sm py-3 font-semibold flex items-center">
                        <div className="w-8 h-8 rounded-full border flex justify-center items-center mr-2 border-black">
                          <Gem className="w-4 h-4" />
                        </div>
                        Price
                      </p>
                      <RadioGroup
                        value={selected.price}
                        onValueChange={(e) =>
                          setSelected((prev) => ({ ...prev, price: e }))
                        }
                        className="flex w-full flex-col p-1 border border-gray-500 rounded-md border-dashed"
                      >
                        {headers.map((item) => (
                          <Label
                            key={item + "price"}
                            htmlFor={item + "price"}
                            className={cn(
                              "flex w-full px-5 py-2 gap-2 items-center rounded hover:bg-sky-100",
                              selected.price === item &&
                                "bg-sky-100 hover:bg-sky-200"
                            )}
                          >
                            <RadioGroupItem value={item} id={item + "price"} />
                            <p>{item}</p>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
