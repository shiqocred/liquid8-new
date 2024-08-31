// "use client";

// import { useCallback, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Ban,
//   Check,
//   ChevronDown,
//   FileSpreadsheet,
//   MoreHorizontal,
//   RefreshCcw,
//   Save,
// } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandGroup,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { useRouter } from "next/navigation";

// interface UploadedFileProps {
//   file: File;
//   name: string;
//   size: number;
// }

// const steps = ["Step 1", "Step 2"];

// const variants = {
//   enter: (direction: number) => {
//     return {
//       x: direction > 0 ? 100 : -100,
//       opacity: 0,
//     };
//   },
//   center: {
//     x: 0,
//     opacity: 1,
//   },
//   exit: (direction: number) => {
//     return {
//       x: direction < 0 ? 100 : -100,
//       opacity: 0,
//     };
//   },
// };

// export const Client = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [selectedFiles, setSelectedFiles] = useState<UploadedFileProps[]>([]);
//   const router = useRouter();

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setDirection(1);
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       router.push("/inbound/check-product/manifest-inbound");
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 0) {
//       setDirection(-1);
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const files = acceptedFiles.map((file) => ({
//       file,
//       name: file.name,
//       size: file.size,
//     }));
//     setSelectedFiles(files);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
//         ".xlsx",
//       ],
//       "application/vnd.ms-excel": [".xls"],
//     },
//   });

//   return (
//     <div className="flex flex-col items-center justify-center bg-gray-100 w-full relative px-4 gap-4 py-4">
//       <div className="grid grid-cols-4 w-full bg-white rounded-md overflow-hidden shadow">
//         <div className="flex border-r px-4 items-center gap-4 w-full h-20">
//           {selectedFiles.length > 0 ? (
//             <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-green-100 text-green-500">
//               <Check className="w-5 h-5" />
//             </div>
//           ) : (
//             <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gray-100">
//               <MoreHorizontal className="w-5 h-5" />
//             </div>
//           )}
//           <div className="flex flex-col">
//             <h5 className="font-medium capitalize">upload file</h5>
//             <p
//               className={cn(
//                 "text-xs",
//                 selectedFiles.length > 0 ? "text-green-500" : "text-gray-400"
//               )}
//             >
//               {selectedFiles.length > 0 ? "completed" : "current"}
//             </p>
//           </div>
//         </div>
//         <div className="flex border-r px-4 items-center gap-4 w-full h-20">
//           <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gray-100">
//             <MoreHorizontal className="w-5 h-5" />
//           </div>
//           <div className="flex flex-col">
//             <h5 className="font-medium capitalize">pick header</h5>
//             <p className="text-xs text-gray-400">
//               {currentStep === 1 ? "current" : "not complete"}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={handlePrev}
//           className={cn(
//             "border-r px-4 items-center w-full h-20 hover:gap-4 gap-2 group transition-all",
//             currentStep === 0 ? "hidden" : "flex"
//           )}
//         >
//           <div className="w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center group-hover:bg-gray-100 transition-all">
//             <ArrowLeft className="w-5 h-5" />
//           </div>
//           <h5 className="font-medium capitalize">previous</h5>
//         </button>
//         <button
//           onClick={handleNext}
//           className={cn(
//             "border-r px-4 items-center w-full h-20 hover:gap-4 gap-2 group transition-all flex disabled:cursor-not-allowed",
//             currentStep === 0 ? "col-span-2" : "col-span-1"
//           )}
//           disabled={selectedFiles.length === 0}
//         >
//           <div
//             className={cn(
//               "w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center  transition-all",
//               currentStep === steps.length - 1
//                 ? "group-hover:bg-green-300"
//                 : "group-hover:bg-gray-100"
//             )}
//           >
//             {currentStep === steps.length - 1 ? (
//               <Save className="w-5 h-5" />
//             ) : selectedFiles.length > 0 ? (
//               <ArrowRight className="w-5 h-5" />
//             ) : (
//               <Ban className="w-5 h-5" />
//             )}
//           </div>
//           <div className="flex flex-col items-start">
//             <h5 className="font-medium capitalize">
//               {currentStep === steps.length - 1 ? "completed" : "next"}
//             </h5>
//             {selectedFiles.length === 0 && (
//               <p className="px-2 rounded bg-red-100 text-xs">
//                 Upload file, please!
//               </p>
//             )}
//           </div>
//         </button>
//       </div>
//       <div className="w-full relative">
//         <AnimatePresence mode="wait" custom={direction}>
//           <motion.div
//             key={currentStep}
//             custom={direction}
//             variants={variants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{ duration: 0.3 }}
//             className="absolute w-full"
//           >
//             {currentStep === 0 && (
//               <div className="p-4 bg-white rounded shadow">
//                 {selectedFiles.length === 0 ? (
//                   <>
//                     <h2 className="text-xl font-bold mb-4">Add new files</h2>
//                     <div
//                       {...getRootProps()}
//                       className={`border-2 border-dashed rounded h-52 flex items-center justify-center text-center cursor-default ${
//                         isDragActive ? "border-blue-500" : "border-gray-300"
//                       }`}
//                     >
//                       <input {...getInputProps()} />
//                       {isDragActive ? (
//                         <p className="text-blue-500">Drop the files here ...</p>
//                       ) : (
//                         <div className="flex justify-center flex-col items-center gap-2">
//                           <p>
//                             Drag & drop some files here, or click to select
//                             files
//                           </p>
//                           <p className="text-sky-500 text-sm font-semibold">
//                             (.xlsx, .xlx)
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="">
//                     {selectedFiles.length > 0 && (
//                       <div>
//                         <div className="flex justify-between items-center">
//                           <h2 className="text-xl font-bold mb-4">
//                             Selected Files
//                           </h2>
//                           <button
//                             className="flex text-sm items-center text-gray-500 hover:underline"
//                             type="button"
//                             onClick={() => setSelectedFiles([])}
//                           >
//                             <RefreshCcw className="w-4 h-4 mr-2" />
//                             Change File
//                           </button>
//                         </div>
//                         <ul className="flex flex-col gap-2">
//                           {selectedFiles.map((file, index) => (
//                             <li
//                               key={index}
//                               className="text-sm flex gap-4 px-5 py-3 rounded-md bg-gray-100"
//                             >
//                               <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gradient-to-br from-green-400 to-green-600 text-white">
//                                 <FileSpreadsheet className="w-5 h-5" />
//                               </div>
//                               <div className="flex flex-col">
//                                 <p className="font-semibold">{file.name}</p>
//                                 <p className="font-light text-gray-500 text-xs">
//                                   {(file.size / 1024).toFixed(2)} KB
//                                 </p>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//             {currentStep === 1 && (
//               <div className="p-4 bg-white rounded shadow flex flex-col gap-6">
//                 <h2 className="text-xl font-bold">Pick Header</h2>
//                 <div className="flex flex-col w-full">
//                   <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
//                     <p className="w-10 text-center flex-none">No</p>
//                     <p className="flex-none w-60">Data Name</p>
//                     <div className="flex w-full gap-4">
//                       <p className="w-1/4 text-center">Resi Number</p>
//                       <p className="w-1/4 text-center">Product Name</p>
//                       <p className="w-1/4 text-center">Quantity</p>
//                       <p className="w-1/4 text-center">Price</p>
//                     </div>
//                   </div>
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <div
//                       className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
//                       key={i}
//                     >
//                       <p className="w-10 flex-none text-center">{i + 1}</p>
//                       <p className="w-60 flex-none">LQD-812129</p>
//                       <div className="flex w-full gap-4 items-center">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               className="w-1/4 justify-between shadow-none hover:bg-sky-50"
//                               variant={"outline"}
//                             >
//                               Choose Header
//                               <ChevronDown className="w-4 h-4" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="p-0 w-52">
//                             <Command>
//                               <CommandGroup>
//                                 <CommandList>
//                                   <CommandItem>Header-1</CommandItem>
//                                   <CommandItem>Header-2</CommandItem>
//                                   <CommandItem>Header-3</CommandItem>
//                                 </CommandList>
//                               </CommandGroup>
//                             </Command>
//                           </PopoverContent>
//                         </Popover>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               className="w-1/4 justify-between shadow-none hover:bg-sky-50"
//                               variant={"outline"}
//                             >
//                               Choose Header
//                               <ChevronDown className="w-4 h-4" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="p-0 w-52">
//                             <Command>
//                               <CommandGroup>
//                                 <CommandList>
//                                   <CommandItem>Header-1</CommandItem>
//                                   <CommandItem>Header-2</CommandItem>
//                                   <CommandItem>Header-3</CommandItem>
//                                 </CommandList>
//                               </CommandGroup>
//                             </Command>
//                           </PopoverContent>
//                         </Popover>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               className="w-1/4 justify-between shadow-none hover:bg-sky-50"
//                               variant={"outline"}
//                             >
//                               Choose Header
//                               <ChevronDown className="w-4 h-4" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="p-0 w-52">
//                             <Command>
//                               <CommandGroup>
//                                 <CommandList>
//                                   <CommandItem>Header-1</CommandItem>
//                                   <CommandItem>Header-2</CommandItem>
//                                   <CommandItem>Header-3</CommandItem>
//                                 </CommandList>
//                               </CommandGroup>
//                             </Command>
//                           </PopoverContent>
//                         </Popover>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               className="w-1/4 justify-between shadow-none hover:bg-sky-50"
//                               variant={"outline"}
//                             >
//                               Choose Header
//                               <ChevronDown className="w-4 h-4" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="p-0 w-52">
//                             <Command>
//                               <CommandGroup>
//                                 <CommandList>
//                                   <CommandItem>Header-1</CommandItem>
//                                   <CommandItem>Header-2</CommandItem>
//                                   <CommandItem>Header-3</CommandItem>
//                                 </CommandList>
//                               </CommandGroup>
//                             </Command>
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  FileSpreadsheet,
  MoreHorizontal,
  RefreshCcw,
  Save,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

interface UploadedFileProps {
  file: File;
  name: string;
  size: number;
}

interface Generate {
  code_document: string;
  headers: string[];
  file_name: string;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedFile, setSelectedFile] = useState<UploadedFileProps | null>(
    null
  );
  const [results, setResults] = useState<Generate | undefined>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const router = useRouter();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile({
          file,
          name: file.name,
          size: file.size,
        });

        // Upload file ke API
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch(
            "https://wms-server.digitalindustryagency.com/api/generate",
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            setResults(result.data.resource);
            setHeaders(result.data.resource.headers);
            setSelectedHeaders(
              new Array(result.data.resource.headers.length).fill(
                "Choose Header"
              )
            );
          } else {
            console.error("Upload failed");
          }
        } catch (error) {
          console.error("An error occurred while uploading the file", error);
        }
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

  const handleHeaderChange = (index: number, header: string) => {
    const newSelectedHeaders = [...selectedHeaders];
    newSelectedHeaders[index] = header;
    setSelectedHeaders(newSelectedHeaders);
  };

  const handleComplete = async () => {
    if (!results || selectedHeaders.length === 0) return;

    const payload = {
      code_document: results.code_document,
      headerMappings: {
        old_barcode_product: [selectedHeaders[0]],
        old_name_product: [selectedHeaders[1]],
        old_quantity_product: [selectedHeaders[2]],
        old_price_product: [selectedHeaders[3]],
      },
    };

    try {
      const response = await fetch(
        "https://wms-server.digitalindustryagency.com/api/generate/merge-headers",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Merge successful:", result);
        // Redirect or show a success message if needed
        router.push("/inbound/check-product/manifest-inbound");
      } else {
        console.error("Merge failed");
      }
    } catch (error) {
      console.error("An error occurred while merging headers", error);
    }
  };

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
          onClick={handlePrev}
          className={cn(
            "border-r px-4 items-center w-full h-20 hover:gap-4 gap-2 group transition-all",
            currentStep === 0 ? "hidden" : "flex"
          )}
        >
          <div className="w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <h5 className="font-medium capitalize">previous</h5>
        </button>
        <button
          onClick={handleNext}
          className={cn(
            "border-r px-4 items-center w-full h-20 hover:gap-4 gap-2 group transition-all flex disabled:cursor-not-allowed",
            currentStep === 0 ? "col-span-2" : "col-span-1"
          )}
          disabled={!selectedFile}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center  transition-all",
              currentStep === steps.length - 1
                ? "group-hover:bg-green-300"
                : "group-hover:bg-gray-100"
            )}
          >
            {currentStep === steps.length - 1 ? (
              <Save className="w-5 h-5" />
            ) : selectedFile ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <Ban className="w-5 h-5" />
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
                <div className="flex flex-col w-full">
                  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                    <p className="w-10 text-center flex-none">No</p>
                    <p className="flex-none w-60">Data Name</p>
                    <div className="flex w-full gap-4">
                      <p className="w-1/4 text-center">Resi Number</p>
                      <p className="w-1/4 text-center">Product Name</p>
                      <p className="w-1/4 text-center">Quantity</p>
                      <p className="w-1/4 text-center">Price</p>
                    </div>
                  </div>
                  <div className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200">
                    <p className="w-10 flex-none text-center">{1}</p>
                    <p className="w-60 flex-none">{results?.code_document}</p>
                    <div className="flex w-full gap-4 items-center">
                      {["Resi Number", "Product Name", "Quantity", "Price"].map(
                        (_, headerIndex) => (
                          <Popover key={headerIndex}>
                            <PopoverTrigger asChild>
                              <Button
                                className="w-1/4 justify-between shadow-none hover:bg-sky-50"
                                variant={"outline"}
                              >
                                {selectedHeaders[headerIndex] ||
                                  "Choose Header"}
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-52">
                              <Command>
                                <CommandGroup>
                                  <CommandList>
                                    {headers.map((header, headerItemIndex) => (
                                      <CommandItem
                                        key={headerItemIndex}
                                        onSelect={() =>
                                          handleHeaderChange(
                                            headerIndex,
                                            header
                                          )
                                        }
                                      >
                                        {header}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )
                      )}
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
