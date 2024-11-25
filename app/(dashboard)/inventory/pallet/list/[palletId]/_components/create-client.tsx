"use client";

import React, {
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRightFromSquare,
  ChevronDown,
  ChevronDownCircle,
  Circle,
  CloudUpload,
  Expand,
  Grid2x2X,
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRupiah } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "../loading";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useModal } from "@/hooks/use-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import Pagination from "@/components/pagination";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const MAX_FILES = 8;
const MAX_FILE_SIZE_MB = 2;
const TOAST_DELAY_MS = 500;

const CreateClient = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();

  // state bool
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenWarehouse, setIsOpenWarehouse] = useState(false);
  const [isOpenCondition, setIsOpenCondition] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isOpenBrands, setIsOpenBrands] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);

  // state search & page
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [page, setPage] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });
  const [pageFiltered, setPageFiltered] = useState({
    current: 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
    perPage: 1,
  });

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state data
  const [input, setInput] = useState({
    name: "",
    category: { id: "", name: "" },
    warehouse: { id: "", name: "" },
    condition: { id: "", name: "" },
    status: { id: "", name: "" },
    brand: [] as { id: string; name: string }[],
    total: "0",
  });
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [condition, setCondition] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [dataFiltered, setDataFiltered] = useState<any[]>([]);
  const [second, setSecond] = useState<File[]>([]);

  // handle GET Data
  const handleGetData = async (p?: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/palet/display?page=${p ?? page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page ?? 1,
        last: response.data.data.resource.last_page ?? 1,
        from: response.data.data.resource.from ?? 0,
        total: response.data.data.resource.total ?? 0,
        perPage: response.data.data.resource.per_page ?? 0,
      });
    } catch (err: any) {
      toast.error("GET DATA: Something went wrong");
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDataFiltered = async () => {
    setLoadingFiltered(true);
    try {
      const response = await axios.get(
        `${baseUrl}/palet/filter_product?page=${page.current}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataRes = response.data.data.resource;
      setDataFiltered(dataRes.data.data);
      setPageFiltered({
        current: dataRes.data.current_page ?? 1,
        last: dataRes.data.last_page ?? 1,
        from: dataRes.data.from ?? 0,
        total: dataRes.data.total ?? 0,
        perPage: dataRes.data.per_page ?? 0,
      });
      setInput((prev) => ({
        ...prev,
        total: Math.round(dataRes.total_new_price).toString(),
      }));
    } catch (err: any) {
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoadingFiltered(false);
    }
  };
  const handleGetSelect = async (p?: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/palet-select`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const dataRes = res.data.data.resource;
      setCategories(dataRes.categories);
      setWarehouses(dataRes.warehouses);
      setBrands(dataRes.product_brands);
      setCondition(dataRes.product_conditions);
      setStatus(dataRes.product_status);
    } catch (err: any) {
      toast.error("GET CATEGORIES: Something went wrong.");
      console.log("ERROR_GET_CATEGORIES:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle Add
  const handleAddProduct = async (e: MouseEvent, id: number) => {
    e.preventDefault();
    setLoadingAdd(true);
    try {
      await axios.post(
        `${baseUrl}/palet/filter_product/${id}/add`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Product successfully added to filter.");
      cookies.set("createPaletFiltered", "removed");
      cookies.set("createPalet", "updated");
    } catch (err: any) {
      toast.error("Product failed add to filter.");
      console.log("ERROR_ADD_FILTER_PRODUCT:", err);
    } finally {
      setLoadingAdd(false);
    }
  };

  // handle Delete
  const handleDeleteProduct = async (e: MouseEvent, id: number) => {
    e.preventDefault();
    setLoadingRemove(true);
    try {
      await axios.delete(`${baseUrl}/palet/filter_product/destroy/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Product successfully removed from filter.");
      cookies.set("createPaletFiltered", "removed");
      cookies.set("createPalet", "removed");
    } catch (err: any) {
      toast.success("Product failde remove from filter.");
      console.log("ERROR_REMOVE_FILTER_PRODUCT:", err);
    } finally {
      setLoadingRemove(false);
    }
  };

  // handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const body = new FormData();
    body.append("name_palet", input.name);
    body.append("total_price_palet", input.total);
    body.append("total_product_palet", dataFiltered.length.toString());
    body.append("category_id", input.category.id);
    body.append("category_palet", input.category.name);
    body.append("category_palet", input.category.name);
    body.append("description", "");
    body.append("is_active", "1");
    body.append("warehouse_id", input.warehouse.id);
    body.append("product_condition_id", input.condition.id);
    body.append("product_status_id", input.status.id);
    body.append("is_sale", "0");
    input.brand.map((item) => body.append("product_brand_ids[]", item.id));
    if (second.length > 0) {
      for (const element of second) {
        body.append("images[]", element);
      }
    }
    try {
      const response = await axios.post(`${baseUrl}/addPalet`, body, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Pallet successfully created.");
      router.push("/inventory/pallet/list");
    } catch (err: any) {
      toast.error("Pallet failed to create.");
      console.log("ERROR_CREATE_PALLET:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // *
  // images
  // *
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      toast.dismiss(); // Menutup semua toast yang aktif

      // Total file yang akan ada setelah menambahkan file baru
      const totalFiles = second.length + acceptedFiles.length;
      const remainingFileSlots = MAX_FILES - second.length;

      // Menyimpan error baru
      const newErrors: string[] = [];

      // Cek batas jumlah file
      if (second.length >= MAX_FILES) {
        newErrors.push(`You can only upload up to ${MAX_FILES} files.`);
      } else if (totalFiles > MAX_FILES) {
        newErrors.push(
          `You can only upload ${remainingFileSlots} more file(s).`
        );
      }

      // Cek batas ukuran file dan hanya tambahkan file yang valid
      const validFiles: File[] = [];
      acceptedFiles.slice(0, remainingFileSlots).forEach((file) => {
        const fileSizeMB = file.size / (1024 * 1024); // Mengonversi byte ke MB
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          newErrors.push(
            `File ${file.name} is larger than ${MAX_FILE_SIZE_MB} MB.`
          );
        } else {
          validFiles.push(file);
        }
      });

      // Menampilkan toast dengan delay untuk setiap error
      newErrors.forEach((error, index) => {
        setTimeout(() => {
          toast.error(error); // Menampilkan toast error
        }, index * TOAST_DELAY_MS); // Delay berdasarkan urutan error
      });

      // Jika tidak ada error, tambahkan file yang valid
      if (validFiles.length > 0) {
        setSecond((prevFiles) => [...prevFiles, ...validFiles]); // Tambahkan file yang valid
      }
    },
    [second]
  );

  // Menangani file yang ditolak
  const onDropRejected = useCallback((rejectedFiles: any[]) => {
    toast.dismiss(); // Menutup semua toast yang aktif

    rejectedFiles.forEach((rejectedFile, index) => {
      const { file, errors } = rejectedFile;
      errors.forEach((error: any, errorIndex: number) => {
        setTimeout(() => {
          if (error.code === "file-too-large") {
            toast.error(
              `File ${file.name} is larger than ${MAX_FILE_SIZE_MB} MB.`
            );
          }
        }, (index + errorIndex) * TOAST_DELAY_MS); // Delay berdasarkan urutan error
      });
    });
    if (rejectedFiles[0].errors[0].code === "too-many-files") {
      toast.error(`You can only upload up to ${MAX_FILES} files.`);
    }
  }, []);

  // Menghapus file berdasarkan index
  const handleRemoveFile = (index: number) => {
    setSecond((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Menggunakan react-dropzone untuk menangani drag-and-drop
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] }, // Hanya mengizinkan gambar
    noClick: true, // Tidak memicu file picker saat halaman diklik, kecuali tombol kecil
    noKeyboard: true, // Mencegah file picker terbuka dengan keyboard
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024, // Konversi dari MB ke byte
  });

  // effect search & page data
  useEffect(() => {
    handleGetData(1);
  }, [searchValue]);
  useEffect(() => {
    if (cookies.get("pageCreatePalet")) {
      handleGetData();
      return cookies.remove("pageCreatePalet");
    }
  }, [cookies.get("pageCreatePalet"), page.current]);
  useEffect(() => {
    handleGetDataFiltered();
  }, [pageFiltered.current]);

  // auto update
  useEffect(() => {
    if (cookies.get("createPaletFiltered")) {
      handleGetDataFiltered();
      return cookies.remove("createPaletFiltered");
    }
  }, [cookies.get("createPaletFiltered")]);
  useEffect(() => {
    if (cookies.get("createPalet")) {
      handleGetData();
      return cookies.remove("createPalet");
    }
  }, [cookies.get("createPalet")]);

  useEffect(() => {
    handleGetSelect();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      {second.length < 8 && (
        <div
          {...getRootProps()}
          className={`top-0 left-0 w-full h-full flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm pointer-events-auto ${
            isDragActive ? "opacity-100 z-20 fixed" : "opacity-0 z-0 absolute"
          }`}
        >
          <div className="w-full h-full flex items-center justify-center border-4 border-sky-100 rounded-lg border-dashed">
            <input {...getInputProps()} />
            <p className="text-5xl text-sky-100 font-bold uppercase">
              Drop image anywhere
            </p>
          </div>
        </div>
      )}
      <Breadcrumb className="z-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Inventory</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/pallet/list">
              Pallet
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/pallet">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none z-10">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold z-10">Create Pallet List</h1>
      </div>
      <div className="w-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          <div className="flex w-full gap-4 bg-white p-5 rounded-md shadow z-10">
            <div className="flex flex-col gap-1 w-1/3 flex-none">
              <Label>Pallet Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                placeholder="Pallet name..."
                value={input.name}
                disabled={loadingSubmit}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="w-full grid grid-cols-5 gap-4">
              <div className="flex flex-col gap-1 w-full col-span-2">
                <Label>Category</Label>
                <Popover open={isOpenCategory} onOpenChange={setIsOpenCategory}>
                  <TooltipProviderPage
                    value={
                      input.category.name
                        ? input.category.name
                        : "Select Category..."
                    }
                    side="bottom"
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                      >
                        <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start">
                          {input.category.name
                            ? input.category.name
                            : "Select Category..."}
                        </p>
                        <ChevronDown className="size-4 flex-none" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipProviderPage>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput />
                      <CommandList className="p-1">
                        <CommandEmpty>No Data Found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((item) => (
                            <CommandItem
                              key={item.id}
                              className="my-2 first:mt-0 last:mb-0 flex gap-2 items-center"
                              onSelect={() => {
                                setInput((prev) => ({
                                  ...prev,
                                  category: {
                                    id: item.id,
                                    name: item.name_category,
                                  },
                                }));
                                setIsOpenCategory(false);
                              }}
                            >
                              <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                                {input.category.id === item.id && (
                                  <Circle className="fill-black size-2.5" />
                                )}
                              </div>
                              <div className="w-full font-medium">
                                {item.name_category}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1 w-full col-span-2">
                <Label>Total Price</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="Rp. 0,00"
                  value={
                    formatRupiah(Math.round(parseFloat(input.total))) ?? "Rp 0"
                  }
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Label>Total Product</Label>
                <Input
                  className="border-sky-400/80 focus-visible:ring-0 border-0 border-b rounded-none focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-100"
                  placeholder="0"
                  value={dataFiltered.length}
                  type="number"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 w-full gap-4 bg-white p-5 rounded-md shadow z-10">
            <div className="flex flex-col gap-1 w-full">
              <Label>Warehouse</Label>
              <Popover open={isOpenWarehouse} onOpenChange={setIsOpenWarehouse}>
                <TooltipProviderPage
                  value={
                    <p className="capitalize">
                      {input.warehouse.name
                        ? input.warehouse.name
                        : "Select Warehouse..."}
                    </p>
                  }
                  side="bottom"
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start capitalize">
                        {input.warehouse.name
                          ? input.warehouse.name
                          : "Select Warehouse..."}
                      </p>
                      <ChevronDown className="size-4 flex-none" />
                    </Button>
                  </PopoverTrigger>
                </TooltipProviderPage>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput />
                    <CommandList className="p-1">
                      <CommandEmpty>No Data Found.</CommandEmpty>
                      <CommandGroup>
                        {warehouses.map((item) => (
                          <CommandItem
                            key={item.id}
                            className="border border-gray-500 my-2 first:mt-0 last:mb-0 flex gap-2 items-center"
                            onSelect={() => {
                              setInput((prev) => ({
                                ...prev,
                                warehouse: {
                                  id: item.id,
                                  name: item.nama,
                                },
                              }));
                              setIsOpenWarehouse(false);
                            }}
                          >
                            <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                              {input.warehouse.id === item.id && (
                                <Circle className="fill-black size-2.5" />
                              )}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <div className="w-full font-medium capitalize">
                                {item.nama}
                              </div>
                              <Separator className="bg-gray-500" />
                              <p className="text-xs text-start w-full text-gray-500">
                                Lat. {item.latitude} | Long. {item.longitude}
                              </p>
                              <p className="text-xs text-start w-full text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                                {item.alamat}
                              </p>
                              <p className="text-xs text-start w-full text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                                {item.kecamatan}, {item.kabupaten},{" "}
                                {item.provinsi}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Condition</Label>
              <Popover open={isOpenCondition} onOpenChange={setIsOpenCondition}>
                <TooltipProviderPage
                  value={
                    <p className="capitalize">
                      {input.condition.name
                        ? input.condition.name
                        : "Select Condition..."}
                    </p>
                  }
                  side="bottom"
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start capitalize">
                        {input.condition.name
                          ? input.condition.name
                          : "Select Condition..."}
                      </p>
                      <ChevronDown className="size-4 flex-none" />
                    </Button>
                  </PopoverTrigger>
                </TooltipProviderPage>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandList className="p-1">
                      <CommandGroup heading="List Condition">
                        {condition.map((item) => (
                          <CommandItem
                            key={item.id}
                            className="border border-gray-500 my-2 first:mt-0 last:mb-0 flex gap-2 items-center"
                            onSelect={() => {
                              setInput((prev) => ({
                                ...prev,
                                condition: {
                                  id: item.id,
                                  name: item.condition_name,
                                },
                              }));
                              setIsOpenCondition(false);
                            }}
                          >
                            <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                              {input.condition.id === item.id && (
                                <Circle className="fill-black size-2.5" />
                              )}
                            </div>
                            <div className="w-full font-medium">
                              {item.condition_name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Status</Label>
              <Popover open={isOpenStatus} onOpenChange={setIsOpenStatus}>
                <TooltipProviderPage
                  value={
                    <p className="capitalize">
                      {input.status.name
                        ? input.status.name
                        : "Select Status..."}
                    </p>
                  }
                  side="bottom"
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="bg-transparent border-b border-sky-400 hover:bg-transparent text-black shadow-none rounded-none justify-between"
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden w-3/4 text-start capitalize">
                        {input.status.name
                          ? input.status.name
                          : "Select Status..."}
                      </p>
                      <ChevronDown className="size-4 flex-none" />
                    </Button>
                  </PopoverTrigger>
                </TooltipProviderPage>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandList className="p-1">
                      <CommandGroup heading="List Status">
                        {status.map((item) => (
                          <CommandItem
                            key={item.id}
                            className="border border-gray-500 my-2 first:mt-0 last:mb-0 flex gap-2 items-center"
                            onSelect={() => {
                              setInput((prev) => ({
                                ...prev,
                                status: {
                                  id: item.id,
                                  name: item.status_name,
                                },
                              }));
                              setIsOpenStatus(false);
                            }}
                          >
                            <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                              {input.status.id === item.id && (
                                <Circle className="fill-black size-2.5" />
                              )}
                            </div>
                            <div className="w-full font-medium">
                              {item.status_name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex w-full gap-4 bg-white px-5 py-3 rounded-md shadow z-10">
            <Dialog open={isOpenBrands} onOpenChange={setIsOpenBrands}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="flex items-center gap-3 font-normal text-black hover:bg-transparent h-auto bg-transparent p-0 shadow-none"
                >
                  <h5 className=" flex-none font-semibold">Brands</h5>
                  <ChevronDownCircle className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-3">
                <DialogHeader>
                  <DialogTitle>Multi Select Brands</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col w-full gap-3">
                  <div className="w-full p-3 border border-sky-400/80 rounded flex flex-wrap gap-3 justify-center items-center">
                    {input.brand.length > 0 && (
                      <div className="w-full text-sm flex justify-between items-center border-b border-sky-400/80 pb-2">
                        <p className="font-semibold w-full text-center">
                          Selected Brands
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setInput((prev) => ({ ...prev, brand: [] }))
                          }
                          className="flex items-center gap-2 px-3 border-l border-sky-400/80 hover:underline hover:underline-offset-2"
                        >
                          <h5 className=" font-semibold">Reset</h5>
                          <XCircle className="size-4" />
                        </button>
                      </div>
                    )}
                    {input.brand.length > 0 ? (
                      input.brand.map((item, i) => (
                        <div
                          key={item.id}
                          className="flex rounded overflow-hidden border border-sky-300"
                        >
                          <div className="px-3 py-0.5 bg-sky-100/80  text-xs font-medium cursor-default capitalize">
                            {item.name}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                brand: prev.brand.filter(
                                  (brand) => brand.id !== item.id
                                ),
                              }))
                            }
                            className="bg-sky-100/80 flex items-center justify-center px-1 border-l border-sky-300 hover:bg-red-200"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-medium h-7 flex items-center">
                        Select a brand...
                      </p>
                    )}
                  </div>
                  <div className="w-full border border-sky-400/80 rounded">
                    <Command>
                      <CommandInput />
                      <CommandList className="max-h-[280px] rounded-none">
                        <CommandEmpty className="text-sm font-medium h-[150px] w-full flex items-center justify-center">
                          No Data Found.
                        </CommandEmpty>
                        <CommandGroup
                          className="min-h-[200px]"
                          heading="List Brands"
                        >
                          {brands.filter(
                            (v) => !input.brand.some((s) => s.id === v.id)
                          ).length > 0 ? (
                            brands
                              .filter(
                                (v) => !input.brand.some((s) => s.id === v.id)
                              )
                              .map((item, i) => (
                                <CommandItem
                                  className="border border-gray-500 my-2 first:mt-0 last:mb-0 flex gap-2 items-center group"
                                  onSelect={() => {
                                    setInput((prev) => ({
                                      ...prev,
                                      brand: [
                                        ...prev.brand,
                                        { id: item.id, name: item.brand_name },
                                      ],
                                    }));
                                  }}
                                  key={item.id}
                                >
                                  <div className="size-4 rounded-full border border-gray-500 flex-none flex items-center justify-center">
                                    <Circle className="fill-black size-2.5 group-hover:flex hidden" />
                                  </div>
                                  <div className="w-full font-medium">
                                    {item.brand_name}
                                  </div>
                                </CommandItem>
                              ))
                          ) : (
                            <div className="w-full h-[150px] flex items-center justify-center text-sm font-medium">
                              <p>No Data viewed.</p>
                            </div>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-sky-400/80 hover:bg-sky-500 text-black"
                    onClick={() => setIsOpenBrands(false)}
                  >
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div
              className={cn(
                "w-full flex gap-3 flex-wrap h-full  border-gray-500 ",
                input.brand.length === 0 ? "border-l pl-4" : "border-x px-4"
              )}
            >
              {input.brand.length === 0 ? (
                <>
                  <div className="px-3 py-0.5 bg-sky-100/80 rounded border border-sky-300 text-xs font-medium cursor-default">
                    Multi Select Input
                  </div>
                  <div className="px-3 py-0.5 bg-sky-100/80 rounded border border-sky-300 text-xs font-medium cursor-default">
                    Select Brand...
                  </div>
                </>
              ) : (
                <>
                  {input.brand.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex rounded overflow-hidden border border-sky-300"
                    >
                      <div className="px-3 py-0.5 bg-sky-100/80  text-xs font-medium cursor-default capitalize">
                        {item.name}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setInput((prev) => ({
                            ...prev,
                            brand: prev.brand.filter(
                              (brand) => brand.id !== item.id
                            ),
                          }))
                        }
                        className="bg-sky-100/80 flex items-center justify-center px-1 border-l border-sky-300 hover:bg-red-200"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
            {input.brand.length > 0 && (
              <button
                type="button"
                onClick={() => setInput((prev) => ({ ...prev, brand: [] }))}
                className="flex items-center gap-2 p-0 flex-none hover:underline hover:underline-offset-2"
              >
                <h5 className=" font-semibold">Reset</h5>
                <XCircle className="size-4" />
              </button>
            )}
          </div>
          <div className="flex flex-col w-full gap-4 bg-white p-5 rounded-md shadow">
            <div className="w-full flex justify-between items-center border-b border-gray-500 pb-4">
              <div className="flex gap-2 items-center">
                <div className="size-8 rounded-full bg-sky-100 flex items-center justify-center flex-none">
                  <CloudUpload className="size-4" />
                </div>
                <h5 className="font-semibold">Upload Image</h5>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium px-5">Drop a file here</p>
                <div className="text-sm font-semibold size-7 rounded-full flex items-center justify-center bg-gray-200">
                  or
                </div>
                <Button
                  type={"button"}
                  onClick={open}
                  className="z-10 bg-transparent hover:bg-transparent text-sky-500 hover:text-sky-700 shadow-none rounded-none underline underline-offset-2 px-5 py-0 h-auto font-medium"
                >
                  Upload File
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-4">
              {second.length > 0 ? (
                <>
                  {second.map((item, i) => (
                    <div
                      key={item.name}
                      className="relative w-full aspect-square shadow border"
                    >
                      <div className="relative w-full h-full overflow-hidden rounded group">
                        <Image
                          alt=""
                          fill
                          src={URL.createObjectURL(item)}
                          className="object-cover group-hover:scale-110 transition-all duration-300"
                        />
                        <button
                          type="button"
                          className="w-full h-full group-hover:delay-500 delay-0 transition-all duration-300 group-hover:opacity-100 opacity-0 flex items-center justify-center absolute top-0 left-0 bg-black/5 backdrop-blur-sm border text-black rounded"
                        >
                          <div className="size-8 flex items-center justify-center bg-white rounded-full">
                            <Expand className="size-5" />
                          </div>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="size-5 hover:scale-110 transition-all rounded-full flex items-center justify-center shadow absolute -top-2 -right-2 bg-red-500 border-2 border-white text-white"
                      >
                        <X className="size-2.5" />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-8 h-36 w-full flex items-center justify-center border-2 border-dashed border-sky-400/80 rounded">
                  <p className="text-sm font-medium">No image yet.</p>
                </div>
              )}
            </div>
          </div>
          {input.name &&
          dataFiltered.length > 0 &&
          input.category &&
          input.warehouse.id &&
          input.condition.id &&
          input.status.id &&
          input.brand.length > 0 ? (
            <div className="flex w-full bg-sky-300 rounded-md overflow-hidden shadow p-5 items-center justify-between gap-4 z-10">
              <div className="w-full flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                <p className="w-full text-sm font-medium">
                  ATTENTION: Make sure all pallets data is correct!
                </p>
              </div>
              <Button
                type="submit"
                disabled={loadingSubmit}
                className="rounded h-10 flex-none bg-transparent border border-black text-black hover:bg-sky-500 hover:border-black hover:text-black disabled:opacity-100"
              >
                {loadingSubmit ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-3" />
                ) : (
                  <Send className="w-4 h-4 mr-3" />
                )}
                Send
              </Button>
            </div>
          ) : (
            <div className="flex w-full bg-red-300 rounded-md overflow-hidden shadow p-5 items-center justify-between gap-4">
              <div className="w-full flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                <p className="w-full text-sm font-medium">
                  ALERT: There must be at least 1 product and fill in all
                  non-optional fields to complete the palette.!
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col z-10">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center gap-4">
          <h3 className="border-b border-gray-500 pr-10 pb-1 w-fit">
            List Products Filtered
          </h3>
          <div className="flex gap-4">
            <TooltipProviderPage value={"Reload Data"}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  cookies.set("createPaletFiltered", "update");
                }}
                className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                variant={"outline"}
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4",
                    loadingFiltered ? "animate-spin" : ""
                  )}
                />
              </Button>
            </TooltipProviderPage>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                  Add Product
                  <ArrowUpRightFromSquare className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[75vw] w-full flex flex-col">
                <DialogHeader>
                  <DialogTitle className="justify-between flex items-center">
                    List Product
                    <TooltipProviderPage value="close" side="left">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-6 h-6 flex items-center justify-center border border-black hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </TooltipProviderPage>
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-5 mt-5 text-sm">
                  <div className="flex gap-4 items-center w-full">
                    <div className="relative flex w-1/3 items-center">
                      <Input
                        className="border-sky-400/80 focus-visible:ring-sky-400 w-full pl-10"
                        placeholder="Search product..."
                        id="searchProduct"
                        value={dataSearch}
                        onChange={(e) => setDataSearch(e.target.value)}
                        autoFocus
                      />
                      <Label
                        htmlFor="searchProduct"
                        className="absolute left-3 cursor-text"
                      >
                        <Search className="w-5 h-5" />
                      </Label>
                    </div>
                    <TooltipProviderPage value={"Reload Data"}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          cookies.set("createPalet", "update");
                        }}
                        className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-black hover:bg-sky-50"
                        variant={"outline"}
                      >
                        <RefreshCw
                          className={cn(
                            "w-4 h-4",
                            loading ? "animate-spin" : ""
                          )}
                        />
                      </Button>
                    </TooltipProviderPage>
                  </div>
                  <div className="w-full p-4 rounded-md border border-sky-400/80 h-full">
                    <ScrollArea className="w-full ">
                      <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                        <p className="w-10 text-center flex-none">No</p>
                        <p className="w-36 flex-none">Barcode</p>
                        <p className="w-full min-w-52 max-w-[450px]">
                          Product Name
                        </p>
                        <p className="w-44 flex-none">Category</p>
                        <p className="w-32 flex-none">Price</p>
                        <p className="w-24 text-center flex-none ml-auto">
                          Action
                        </p>
                      </div>
                      {loading ? (
                        <div className="w-full h-[50vh]">
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                              key={i}
                            >
                              <div className="w-10 flex justify-center flex-none">
                                <Skeleton className="w-7 h-4" />
                              </div>
                              <div className="w-36 flex-none">
                                <Skeleton className="w-28 h-4" />
                              </div>
                              <div className="w-full min-w-52 max-w-[450px]">
                                <Skeleton className="w-44 h-4" />
                              </div>
                              <div className="w-32 flex-none">
                                <Skeleton className="w-24 h-4" />
                              </div>
                              <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                                <Skeleton className="w-20 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ScrollArea className="h-[50vh]">
                          {
                            // filtered.length > 0 ? (
                            data.length > 0 ? (
                              data.map((item, i) => (
                                <div
                                  className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                                  key={item.id}
                                >
                                  <p className="w-10 text-center flex-none">
                                    {page.from + i}
                                  </p>
                                  <TooltipProviderPage
                                    value={
                                      item.new_barcode_product ??
                                      item.old_barcode_product
                                    }
                                  >
                                    <p className="w-36 flex-none overflow-hidden text-ellipsis">
                                      {item.new_barcode_product ??
                                        item.old_barcode_product}
                                    </p>
                                  </TooltipProviderPage>
                                  <TooltipProviderPage
                                    value={
                                      <p className="w-auto max-w-52 ">
                                        {item.new_name_product}
                                      </p>
                                    }
                                  >
                                    <p className="w-full min-w-52 max-w-[450px] whitespace-nowrap text-ellipsis overflow-hidden">
                                      {item.new_name_product}
                                    </p>
                                  </TooltipProviderPage>
                                  <TooltipProviderPage
                                    value={
                                      item.new_category_product ??
                                      item.new_tag_product
                                    }
                                  >
                                    <p className="w-44 flex-none whitespace-nowrap text-ellipsis overflow-hidden">
                                      {item.new_category_product ??
                                        item.new_tag_product}
                                    </p>
                                  </TooltipProviderPage>
                                  <p className="w-32 flex-none">
                                    {formatRupiah(item.new_price_product) ??
                                      "Rp 0"}
                                  </p>
                                  <div className="w-24 ml-auto flex-none flex gap-4 justify-center">
                                    <Button
                                      className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                                      variant={"outline"}
                                      type="button"
                                      onClick={(e) =>
                                        handleAddProduct(e, item.id)
                                      }
                                    >
                                      {loadingAdd ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                      ) : (
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                      )}
                                      <div>Add</div>
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="h-[45vh] flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <Grid2x2X className="w-8 h-8" />
                                  <p className="text-sm font-semibold">
                                    No Data Viewed.
                                  </p>
                                </div>
                              </div>
                            )
                          }
                        </ScrollArea>
                      )}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <Pagination
                    pagination={page}
                    setPagination={setPage}
                    cookie="pageCreatePalet"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-48 flex-none">Barcode</p>
                <p className="w-full min-w-96 max-w-[800px]">Product Name</p>
                <p className="w-24 text-center flex-none ml-auto">Action</p>
              </div>
              {loadingFiltered ? (
                <div className="w-full">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                      key={i}
                    >
                      <div className="w-10 flex justify-center flex-none">
                        <Skeleton className="w-7 h-4" />
                      </div>
                      <div className="w-48 flex-none">
                        <Skeleton className="w-32 h-4" />
                      </div>
                      <div className="w-full min-w-96 max-w-[800px]">
                        <Skeleton className="w-96 h-4" />
                      </div>
                      <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[300px]">
                  {dataFiltered.length > 0 ? (
                    dataFiltered.map((item, i) => (
                      <div
                        className="flex w-full px-5 py-2.5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                        key={item.id}
                      >
                        <p className="w-10 text-center flex-none">
                          {pageFiltered.from + i}
                        </p>
                        <p className="w-48 flex-none overflow-hidden text-ellipsis">
                          {item.new_barcode_product ?? item.old_barcode_product}
                        </p>
                        <TooltipProviderPage
                          value={
                            <p className="w-auto max-w-72 ">
                              {item.new_name_product}
                            </p>
                          }
                        >
                          <p className="w-full min-w-96 max-w-[800px] whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.new_name_product}
                          </p>
                        </TooltipProviderPage>
                        <div className="w-24 flex-none flex gap-4 justify-center ml-auto">
                          <Button
                            className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                            variant={"outline"}
                            type="button"
                            onClick={(e) => handleDeleteProduct(e, item.id)}
                            disabled={loadingRemove}
                          >
                            {loadingRemove ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            <div>Delete</div>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Grid2x2X className="w-8 h-8" />
                        <p className="text-sm font-semibold">No Data Viewed.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Pagination
            pagination={pageFiltered}
            setPagination={setPageFiltered}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
