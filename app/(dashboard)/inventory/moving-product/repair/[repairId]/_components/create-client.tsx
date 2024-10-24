"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah, generateRandomString } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "../loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { useCookies } from "next-client-cookies";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { toast } from "sonner";
import qs from "query-string";
import { Badge } from "@/components/ui/badge";

const CreateClient = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const [RepairId, setRepairId] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [filteredTotalProducts, setFilteredTotalProducts] = useState(0);
  const [totalNewPrice, setTotalNewPrice] = useState("0");
  const [RepairName, setRepairName] = useState("");
  const [colorName, setColorName] = useState("");
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");

  const [pageFiltered, setPageFiltered] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });
  const [filtered, setFiltered] = useState(searchParams.get("f") ?? "");

  const fetchProductRepair = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any>(
        `${baseUrl}/new_product/display-expired?page=${page}&q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProducts(response.data.data.resource.data);
      setTotalPages(response.data.data.resource.last_page);
      setTotalProducts(response.data.data.resource.total);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addProductToRepair = async (productId: number) => {
    try {
      const response = await axios.post(
        `${baseUrl}/repair-mv/filter_product/${productId}/add`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 || response.data.status === true) {
        fetchProductRepair();
        fetchFilteredProducts();
        toast.success(
          response.data.message || "Product added to repair successfully"
        );
      } else {
        toast.error(response.data.message || "Failed to add product to repair");
      }
    } catch (error: any) {
      console.error("Error adding product to repair:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding product to repair"
      );
    }
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any>(
        `${baseUrl}/repair-mv/filter_product?page=${filteredPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resource = response.data.data.resource;
      setFilteredProducts(resource.data.data);
      setFilteredTotalPages(resource.data.last_page);
      setFilteredTotalProducts(resource.data.total);
      setTotalNewPrice(resource.total_new_price);
      setTotalPrice(resource.total_new_price);
      setPageFiltered({
        current: response.data.data.resource.data.current_page,
        last: response.data.data.resource.data.last_page,
        from: response.data.data.resource.data.from,
        total: response.data.data.resource.data.total,
      });
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching filtered products"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteFilteredProduct = async (id: number) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/repair-mv/filter_product/destroy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success(
          response.data.message || "Product removed from repair successfully"
        );
        fetchFilteredProducts();
        fetchProductRepair();
      } else {
        toast.error(
          response.data.message || "Failed to remove product from repair"
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while removing product from repair"
      );
    }
  };

  const createRepair = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const parsedTotalPrice = Number(totalPrice);
    const parsedCustomPrice = Number(customPrice);

    if (isNaN(parsedTotalPrice) || isNaN(parsedCustomPrice)) {
      toast.error("Total Price and Custom Price must be valid numbers");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/repair-mv`, // Your endpoint
        {
          repair_name: RepairName,
          total_price: parsedTotalPrice,
          total_custom_price: parsedCustomPrice,
          total_products: filteredTotalProducts,
          barcode: generateRandomString(10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.data.status === true) {
        toast.success(response.data.message || "Repair created successfully");
        router.push("/inventory/moving-product/repair");
        setRepairName("");
        setTotalPrice(0);
        setCustomPrice(0);
      } else {
        toast.error(response.data.message || "Failed to create repair");
      }
    } catch (error: any) {
      console.error("Error creating repair:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating repair"
      );
    }
  };

  // handle search params
  const handleCurrentId = useCallback(
    (q: string, f: string, p: number) => {
      setFilter(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
        page: p,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }
      if (!p || p === 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inventory/moving-product/repair/create",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  // handle search params
  const handleCurrentIdFilter = useCallback(
    (q: string, f: string, p: number) => {
      setFiltered(f);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
        page: p,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFiltered("");
      }
      if (!p || p === 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inventory/moving-product/repair/create",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, '').replace(/,/g, '.'); // Menghapus titik dan mengganti koma dengan titik
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setTotalPrice(numericValue);
    } else {
      setTotalPrice(0); // Atau bisa disesuaikan dengan logika yang diinginkan
    }
  };

  // effect update search & page
  useEffect(() => {
    handleCurrentId(searchValue, filter, 1);
    fetchProductRepair();
    fetchFilteredProducts();
  }, [searchValue]);

  // effect update when...
  useEffect(() => {
    if (cookies.get("repair/create")) {
      handleCurrentId(searchValue, filter, page.current);
      fetchProductRepair();
      fetchFilteredProducts();
      return cookies.remove("repair/create");
    }
  }, [cookies.get("repair/create"), searchValue, page.current]);

  // effect update search & page
  useEffect(() => {
    handleCurrentIdFilter(searchValue, filtered, 1);
    fetchProductRepair();
    fetchFilteredProducts();
  }, [searchValue]);

  // effect update when...
  useEffect(() => {
    if (cookies.get("repair/create")) {
      handleCurrentIdFilter(searchValue, filtered, pageFiltered.current);
      fetchProductRepair();
      fetchFilteredProducts();
      return cookies.remove("repair/create");
    }
  }, [cookies.get("repair/create"), searchValue, pageFiltered.current]);

  useEffect(() => {
    setIsMounted(true);
    fetchProductRepair();
    fetchFilteredProducts();
  }, []);

  if (!isMounted) {
    return <Loading />;
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
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory/moving-product/repair">
              Repair
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/repair">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create Repair</h1>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-1/4 flex flex-col">
          <form
            className="flex h-[425px] flex-col w-full gap-4 bg-white p-5 rounded-md shadow"
            onSubmit={createRepair} // This will call createRepair function on form submission
          >
            <div className="w-full py-1 mb-2 border-b border-gray-500 text-xl font-semibold">
              <h3>Data Repair</h3>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Repair Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Repair name..."
                required // Ensure it's required
                value={RepairName} // Bind to state
                onChange={(e) => setRepairName(e.target.value)} // Update state on change
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Total Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Rp. 0,00"
                required // Ensure it's required
                disabled // Keep this disabled if needed
                value={formatRupiah(totalPrice)} // Format and bind to total price state
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Custom Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="0,00"
                required // Ensure it's required
                value={formatRupiah(customPrice)} // Bind to state
              />
            </div>
            <Button
              className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto"
              type="submit"
            >
              Create
            </Button>
          </form>

          {/* <form className="flex h-[425px] flex-col w-full gap-4 bg-white p-5 rounded-md shadow">
            <div className="w-full py-1 mb-2 border-b border-gray-500 text-xl font-semibold">
              <h3>Data Repair</h3>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Repair Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Repair name..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Total Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Rp. 0,00"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Custom Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="0,00"
                type="number"
              />
            </div>
            <Button className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto">
              Create
            </Button>
          </form> */}
        </div>
        <div className="w-3/4 flex flex-col h-[425px] bg-white rounded-md shadow overflow-hidden p-5">
          <div className="w-full py-1 mb-6 border-b border-gray-500 text-xl font-semibold">
            <h3>Product Filtered</h3>
          </div>
          <div className="flex flex-col w-full gap-4">
            <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
              <p className="w-10 text-center flex-none">No</p>
              <p className="w-32 flex-none">Barcode</p>
              <p className="w-full">Product Name</p>
              <p className="w-24 text-center flex-none">Action</p>
            </div>
            <ScrollArea className="w-full h-[212px]">
              <div className="w-full">
                {filteredProducts.map((filteredProduct: any, i: any) => (
                  <div
                    className="flex w-full px-5 py-2 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    key={i}
                  >
                    <p className="w-10 text-center flex-none">{i + 1}</p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      {(() => {
                        let barcode: string | undefined;
                        if (
                          !filteredProduct.new_category_product &&
                          !filteredProduct.new_tag_product
                        ) {
                          barcode = filteredProduct.old_barcode_product;
                        } else if (
                          filteredProduct.new_category_product !== null
                        ) {
                          barcode =
                            filteredProduct.new_barcode_product ?? undefined;
                        } else if (filteredProduct.new_tag_product !== null) {
                          barcode = filteredProduct.old_barcode_product;
                        }
                        return barcode ?? "";
                      })()}{" "}
                    </p>
                    <p className="w-full whitespace-pre-wrap">
                      {filteredProduct.new_name_product}
                    </p>
                    <div className="w-24 flex-none flex gap-4 justify-center">
                      <Button
                        className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          deleteFilteredProduct(filteredProduct.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <div>Delete</div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-between">
              <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
                Total: {pageFiltered.total}
              </Badge>
              <div className="flex gap-5 items-center">
                <p className="text-sm">
                  Page {pageFiltered.current} of {pageFiltered.last}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() => {
                      setPage((prev) => ({
                        ...prev,
                        current: prev.current - 1,
                      }));
                      cookies.set("repair/create", "remove");
                    }}
                    disabled={pageFiltered.current === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() => {
                      setPage((prev) => ({
                        ...prev,
                        current: prev.current + 1,
                      }));
                      cookies.set("repair/create", "add");
                    }}
                    disabled={pageFiltered.current === pageFiltered.last}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 flex-col">
        <div className="w-full my-5 text-xl font-semibold flex justify-between items-center">
          <h3 className="border-b border-gray-500 pr-10 pb-1">List Products</h3>
          <div className="relative flex w-1/4 items-center">
            <Input
              className="border-sky-400/80 focus-visible:ring-sky-400 w-full pl-10"
              placeholder="Search product..."
            />
            <Label className="absolute left-3">
              <Search className="w-5 h-5" />
            </Label>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-4 font-semibold items-center hover:bg-sky-200/80">
            <p className="w-10 text-center flex-none">No</p>
            <p className="w-32 flex-none">Barcode</p>
            <p className="w-full">Product Name</p>
            <p className="w-44 flex-none">Category</p>
            <p className="w-32 flex-none">Price</p>
            <p className="w-24 text-center flex-none">Action</p>
          </div>
          <div className="w-full">
            {products.map((product: any, i: any) => (
              <div
                className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                key={i}
              >
                <p className="w-10 text-center flex-none">{i + 1}</p>
                <p className="w-32 flex-none overflow-hidden text-ellipsis">
                  {(() => {
                    let barcode: string | undefined;
                    if (
                      !product.new_category_product &&
                      !product.new_tag_product
                    ) {
                      barcode = product.old_barcode_product;
                    } else if (product.new_category_product !== null) {
                      barcode = product.new_barcode_product ?? undefined;
                    } else if (product.new_tag_product !== null) {
                      barcode = product.old_barcode_product;
                    }
                    return barcode ?? "";
                  })()}{" "}
                </p>
                <p className="w-full whitespace-pre-wrap">
                  {product.new_name_product}
                </p>
                <p className="w-44 flex-none">
                  {" "}
                  {product.new_category_product
                    ? product.new_category_product
                    : product.new_tag_product}
                </p>
                <p className="w-32 flex-none">
                  {" "}
                  {(() => {
                    let price: string | undefined;

                    if (
                      product.new_category_product !== null &&
                      product.new_category_product !== undefined
                    ) {
                      price = product.new_price_product;
                    } else if (
                      product.new_tag_product !== null &&
                      product.new_tag_product !== undefined
                    ) {
                      price = product.fixed_price;
                    } else {
                      price = product.old_price_product;
                    }
                    const numericalPrice = price ? Number(price) : 0;

                    return formatRupiah(numericalPrice);
                  })()}
                </p>
                <div className="w-24 flex-none flex gap-4 justify-center">
                  <Button
                    className="items-center border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                    variant={"outline"}
                    type="button"
                    onClick={() => addProductToRepair(product.id)}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    <div>Add</div>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Badge className="rounded-full hover:bg-sky-100 bg-sky-100 text-black border border-sky-500 text-sm">
              Total: {page.total}
            </Badge>
            <div className="flex gap-5 items-center">
              <p className="text-sm">
                Page {page.current} of {page.last}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() => {
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }));
                    cookies.set("repair/create", "remove");
                  }}
                  disabled={page.current === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() => {
                    setPage((prev) => ({ ...prev, current: prev.current + 1 }));
                    cookies.set("repair/create", "add");
                  }}
                  disabled={page.current === page.last}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
