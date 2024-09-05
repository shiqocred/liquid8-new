// "use client";

// import { Badge } from "@/components/ui/badge";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Command,
//   CommandGroup,
//   CommandItem,
//   CommandList,
//   CommandShortcut,
// } from "@/components/ui/command";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Separator } from "@/components/ui/separator";
// import { useDebounce } from "@/hooks/use-debounce";
// import { cn, formatRupiah } from "@/lib/utils";
// import {
//   ChevronLeft,
//   ChevronRight,
//   CircleFadingPlus,
//   ReceiptText,
//   ShieldCheck,
//   Trash2,
//   XCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import qs from "query-string";
// import { useCallback, useEffect, useState } from "react";

// export const Client = () => {
//   const [isFilter, setIsFilter] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [dataSearch, setDataSearch] = useState("");
//   const searchValue = useDebounce(dataSearch);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [filter, setFilter] = useState(searchParams.get("f") ?? "");

//   const handleCurrentId = useCallback(
//     (q: string, f: string) => {
//       setFilter(f);
//       let currentQuery = {};

//       if (searchParams) {
//         currentQuery = qs.parse(searchParams.toString());
//       }

//       const updateQuery: any = {
//         ...currentQuery,
//         q: q,
//         f: f,
//       };

//       if (!q || q === "") {
//         delete updateQuery.q;
//       }
//       if (!f || f === "") {
//         delete updateQuery.f;
//         setFilter("");
//       }

//       const url = qs.stringifyUrl(
//         {
//           url: "/inventory/product/category",
//           query: updateQuery,
//         },
//         { skipNull: true }
//       );

//       router.push(url);
//     },
//     [searchParams, router]
//   );

//   useEffect(() => {
//     handleCurrentId(searchValue, filter);
//   }, [searchValue]);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return "Loading...";
//   }

//   return (
//     <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Home</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>Product by Category</BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>
//       <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
//         <h2 className="text-xl font-bold">List Product by Category</h2>
//         <div className="flex flex-col w-full gap-4">
//           <div className="flex gap-2 items-center w-full">
//             <Input
//               className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
//               value={dataSearch}
//               onChange={(e) => setDataSearch(e.target.value)}
//               placeholder="Search..."
//             />
//             <div className="flex items-center gap-3">
//               <Popover open={isFilter} onOpenChange={setIsFilter}>
//                 <PopoverTrigger asChild>
//                   <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
//                     <CircleFadingPlus className="h-4 w-4 mr-2" />
//                     Category
//                     {filter && (
//                       <Separator
//                         orientation="vertical"
//                         className="mx-2 bg-gray-500 w-[1.5px]"
//                       />
//                     )}
//                     {filter && (
//                       <Badge
//                         className={cn(
//                           "rounded w-20 px-0 justify-center text-black font-normal capitalize",
//                           filter === "display" &&
//                             "bg-yellow-200 hover:bg-yellow-200",
//                           filter === "expired" && "bg-red-200 hover:bg-red-200"
//                         )}
//                       >
//                         {filter === "display" && "Display"}
//                         {filter === "expired" && "Expired"}
//                       </Badge>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="p-0 w-52" align="start">
//                   <Command>
//                     <CommandGroup>
//                       <CommandList>
//                         <CommandItem
//                           onSelect={() => {
//                             handleCurrentId(dataSearch, "display");
//                             setIsFilter(false);
//                           }}
//                         >
//                           <Checkbox
//                             className="w-4 h-4 mr-2"
//                             checked={filter === "display"}
//                             onCheckedChange={() => {
//                               handleCurrentId(dataSearch, "display");
//                               setIsFilter(false);
//                             }}
//                           />
//                           Display
//                         </CommandItem>
//                         <CommandItem
//                           onSelect={() => {
//                             handleCurrentId(dataSearch, "expired");
//                             setIsFilter(false);
//                           }}
//                         >
//                           <Checkbox
//                             className="w-4 h-4 mr-2"
//                             checked={filter === "expired"}
//                             onCheckedChange={() => {
//                               handleCurrentId(dataSearch, "expired");
//                               setIsFilter(false);
//                             }}
//                           />
//                           Expired
//                         </CommandItem>
//                       </CommandList>
//                     </CommandGroup>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               {filter && (
//                 <Button
//                   variant={"ghost"}
//                   className="flex px-3"
//                   onClick={() => {
//                     handleCurrentId(dataSearch, "");
//                   }}
//                 >
//                   Reset
//                   <XCircle className="h-4 w-4 ml-2" />
//                 </Button>
//               )}
//             </div>
//           </div>
//           <div className="w-full p-4 rounded-md border border-sky-400/80">
//             <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
//               <p className="w-10 text-center flex-none">No</p>
//               <p className="w-28 flex-none">Barcode</p>
//               <p className="w-full">Product Name</p>
//               <p className="w-32 flex-none">Category</p>
//               <p className="w-32 flex-none">Price</p>
//               <p className="w-36 flex-none">Date</p>
//               <p className="w-28 flex-none">Status</p>
//               <p className="xl:w-48 w-28 text-center flex-none">Action</p>
//             </div>
//             {Array.from({ length: 5 }, (_, i) => (
//               <div
//                 className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
//                 key={i}
//               >
//                 <p className="w-10 text-center flex-none">{i + 1}</p>
//                 <p className="w-28 flex-none overflow-hidden text-ellipsis">
//                   LQD43520
//                 </p>
//                 <p className="w-full whitespace-pre-wrap">
//                   MOONSITE Sepatu Sneakers Wanita Casual Shoe Windisy Sepatu
//                   Import Sepatu Santai Jalan KeMal Kekinian
//                 </p>
//                 <p className="w-32 flex-none whitespace-pre-wrap">
//                   TOYS HOBBIES (0-199)
//                 </p>
//                 <p className="w-32 flex-none whitespace-pre-wrap">
//                   {formatRupiah(1000000)}
//                 </p>
//                 <p className="w-36 flex-none whitespace-pre-wrap">
//                   Kamis, 24-06-2024
//                 </p>
//                 <div className="w-28 flex-none">
//                   <Badge
//                     className={cn(
//                       "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-gray-200 hover:bg-gray-200"
//                     )}
//                   >
//                     Display
//                   </Badge>
//                 </div>
//                 <div className="xl:w-48 w-28 flex-none flex gap-4 justify-center">
//                   <Button
//                     className="items-center xl:w-full w-9 px-0 xl:px-4 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
//                     variant={"outline"}
//                     type="button"
//                     onClick={() => alert("pop up")}
//                   >
//                     <ReceiptText className="w-4 h-4 xl:mr-1" />
//                     <p className="hidden xl:flex">Detail</p>
//                   </Button>
//                   <Button
//                     className="items-center xl:w-full w-9 px-0 xl:px-4 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
//                     variant={"outline"}
//                     type="button"
//                     onClick={() => alert("pop up")}
//                   >
//                     <Trash2 className="w-4 h-4 xl:mr-1" />
//                     <div className="hidden xl:flex">Delete</div>
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-5 ml-auto items-center">
//             <p className="text-sm">Page 1 of 3</p>
//             <div className="flex items-center gap-2">
//               <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
//                 <ChevronLeft className="w-5 h-5" />
//               </Button>
//               <Button className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
//                 <ChevronRight className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingPlus,
  ReceiptText,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";

interface Category {
  id: string;
  new_barcode_product: string;
  new_name_product: string;
  new_category_product: string;
  new_price_product: string;
  new_status_product: "display";
  display_price: string;
  created_at: string;
  new_date_in_product: string;
}

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const fetchCategory = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/product_byCategory?page=${page}&q=${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Menambahkan header Authorization
            },
          }
        );
        setCategory(response.data.data.resource.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      fetchCategory(page, searchValue);
    }
  }, [searchValue, page, fetchCategory, accessToken]);

  const handleCurrentId = useCallback(
    (q: string, f: string) => {
      setFilter(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }

      const url = qs.stringifyUrl(
        {
          url: "/inventory/product/category",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, filter);
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "Loading...";
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Product by Category</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Product by Category</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex items-center gap-3">
              <Popover open={isFilter} onOpenChange={setIsFilter}>
                <PopoverTrigger asChild>
                  <Button className="border-sky-400/80 border text-black bg-transparent border-dashed hover:bg-transparent flex px-3 hover:border-sky-400">
                    <CircleFadingPlus className="h-4 w-4 mr-2" />
                    Category
                    {filter && (
                      <Separator
                        orientation="vertical"
                        className="mx-2 bg-gray-500 w-[1.5px]"
                      />
                    )}
                    {filter && (
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                          filter === "display" &&
                            "bg-yellow-200 hover:bg-yellow-200",
                          filter === "expired" && "bg-red-200 hover:bg-red-200"
                        )}
                      >
                        {filter === "display" && "Display"}
                        {filter === "expired" && "Expired"}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-52" align="start">
                  <Command>
                    <CommandGroup>
                      <CommandList>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "display");
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "display"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "display");
                              setIsFilter(false);
                            }}
                          />
                          Display
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            handleCurrentId(dataSearch, "expired");
                            setIsFilter(false);
                          }}
                        >
                          <Checkbox
                            className="w-4 h-4 mr-2"
                            checked={filter === "expired"}
                            onCheckedChange={() => {
                              handleCurrentId(dataSearch, "expired");
                              setIsFilter(false);
                            }}
                          />
                          Expired
                        </CommandItem>
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {filter && (
                <Button
                  variant={"ghost"}
                  className="flex px-3"
                  onClick={() => {
                    handleCurrentId(dataSearch, "");
                  }}
                >
                  Reset
                  <XCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80 overflow-hidden">
            <ScrollArea>
              <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
                <p className="w-10 text-center flex-none">No</p>
                <p className="w-28 flex-none">Barcode</p>
                <p className="w-72">Product Name</p>
                <p className="w-44 flex-none">Category</p>
                <p className="w-44 flex-none">Price</p>
                <p className="w-60 flex-none">Date</p>
                <p className="w-28 flex-none">Status</p>
                <p className="w-48 text-center flex-none">Action</p>
              </div>
              {category.map((item, index) => (
                <div
                  className="flex w-full px-5 py-5 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                  key={item.id}
                >
                  <p className="w-10 text-center flex-none">{index + 1}</p>
                  <p className="w-28 flex-none overflow-hidden text-ellipsis">
                    {item.new_barcode_product}
                  </p>
                  <p className="w-72 whitespace-pre-wrap">
                    {item.new_name_product}
                  </p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    {item.new_category_product}
                  </p>
                  <p className="w-44 flex-none whitespace-pre-wrap">
                    {formatRupiah(parseFloat(item.new_price_product))}
                  </p>
                  <p className="w-60 flex-none whitespace-pre-wrap">
                    {/* {new Date(item.new_date_in_product).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )} */}
                    {format(item.new_date_in_product, "iiii, dd MMMM yyyy")}
                  </p>
                  <div className="w-28 flex-none">
                    <Badge
                      className={cn(
                        "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                        item.new_status_product === "display"
                          ? "bg-green-400 hover:bg-green-400"
                          : "bg-gray-200 hover:bg-gray-200"
                      )}
                    >
                      {item.new_status_product.charAt(0).toUpperCase() +
                        item.new_status_product.slice(1)}
                    </Badge>
                    {/* <Badge
                    className={cn(
                      "rounded w-20 px-0 justify-center text-black font-normal capitalize",
                      item.new_status_product === "pending" && "bg-yellow-200 hover:bg-yellow-200",
                      item.new_status_product === "in-progress" && "bg-blue-200 hover:bg-blue-200",
                      item.new_status_product === "done" && "bg-green-200 hover:bg-green-200"
                    )}
                  >
                    {item.new_status_product}
                  </Badge> */}
                  </div>
                  <div className="w-48 flex-none flex gap-4 justify-center">
                    <Button
                      className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <ReceiptText className="w-4 h-4 mr-1" />
                      <p>Detail</p>
                    </Button>
                    <Button
                      className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                      variant={"outline"}
                      type="button"
                      onClick={() => alert("pop up")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <div>Delete</div>
                    </Button>
                  </div>
                </div>
              ))}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="flex gap-5 ml-auto items-center">
            <p className="text-sm">Page {page} of 3</p>
            <div className="flex items-center gap-2">
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
