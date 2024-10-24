"use client";
import React, { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "@/lib/baseUrl";
import { formatRupiah } from "@/lib/utils";

interface ProductData {
  id: number;
  new_barcode_product: string;
  old_barcode_product: string;
  new_name_product: string;
  new_price_product: string;
  new_category_product: string;
  new_tag_product: string;
  fixed_price: string | undefined;
  old_price_product: string;
  display_price: string;
}

interface ApiResponse {
  data: {
    status: boolean;
    message: string;
    resource: {
      current_page: number;
      data: ProductData[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: string;
      path: string;
      per_page: number;
      prev_page_url: string;
      to: number;
      total: number;
    };
  };
}

interface FilteredProductData {
  id: number;
  new_barcode_product: string;
  old_barcode_product: string;
  new_name_product: string;
  new_price_product: string;
  new_category_product: string;
  new_tag_product: string;
  display_price: string;
}

interface CategoryData {
  id: number;
  name_category: string;
  discount_category: number;
  max_price_category: string;
}

interface FilteredProductsResponse {
  data: {
    status: boolean;
    message: string;
    resource: {
      total_new_price: string;
      category: CategoryData[];
      data: {
        current_page: number;
        data: FilteredProductData[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
      };
    };
  };
}

const CreateClient = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const [bundleId, setBundleId] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [filteredTotalProducts, setFilteredTotalProducts] = useState(0);
  const [totalNewPrice, setTotalNewPrice] = useState("0");
  const [bundleName, setBundleName] = useState("");
  const [colorName, setColorName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("0");
  const [isCategory, setIsCategory] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchProducts = async () => {
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
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addProductToBundle = async (productId: number) => {
    try {
      const response = await axios.post(
        `${baseUrl}/bundle/filter_product/${productId}/add`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 || response.data.status === true) {
        fetchProducts();
        fetchFilteredProducts();
        alert(response.data.message || "Product added to bundle successfully");
      } else {
        alert(response.data.message || "Failed to add product to bundle");
      }
    } catch (error: any) {
      console.error("Error adding product to bundle:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while adding product to bundle"
      );
    }
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any>(
        `${baseUrl}/bundle/filter_product?page=${filteredPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      const resource = response.data.data.resource;
      console.log("resource", resource);
      setFilteredProducts(resource.data.data);
      setFilteredTotalPages(resource.data.last_page);
      setFilteredTotalProducts(resource.data.total);
      setTotalNewPrice(resource.total_new_price);
      setTotalPrice(resource.total_new_price);
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
        `${baseUrl}/bundle/filter_product/destroy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        alert(
          response.data.message || "Product removed from bundle successfully"
        );
        fetchFilteredProducts();
        fetchProducts();
      } else {
        alert(response.data.message || "Failed to remove product from bundle");
      }
    } catch (error: any) {
      console.error("Error removing product from bundle:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while removing product from bundle"
      );
    }
  };

  const createBundle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        `${baseUrl}/bundle`, // Add your endpoint here
        {
          name: bundleName,
          total_price: totalPrice,
          color: colorName,
          custom_price: customPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 || response.data.status === true) {
        alert(response.data.message || "Bundle created successfully");
        setBundleName("");
        setTotalPrice("");
        setColorName("");
        setCustomPrice("");
      } else {
        toast.error(response.data.message || "Failed to create bundle");
      }
    } catch (error: any) {
      console.error("Error creating bundle:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while creating bundle"
      );
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
    fetchFilteredProducts();
  }, [page, searchQuery, filteredPage]);

  if (!isMounted) {
    return "loading...";
  }
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
            <BreadcrumbLink href="/inventory/moving-product/bundle">
              Bundle
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-2 justify-start items-center pt-2 pb-1 mb-1 border-b border-gray-500">
        <Link href="/inventory/moving-product/bundle">
          <Button className="w-9 h-9 bg-transparent hover:bg-white p-0 shadow-none">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create Bundle</h1>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-1/4 flex flex-col">
          <form
            className="flex h-[425px] flex-col w-full gap-4 bg-white p-5 rounded-md shadow"
            onSubmit={createBundle}
          >
            <div className="w-full py-1 mb-2 border-b border-gray-500 text-xl font-semibold">
              <h3>Data Bundle</h3>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Bundle Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Bundle name..."
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Total Price</Label>
              <Input
                disabled
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Rp. 0,00"
                type="number"
                value={totalPrice.toString()} // Convert number to string for input
                onChange={(e) => setTotalPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Color Name</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="Color name..."
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                // required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Custom Price</Label>
              <Input
                className="border-sky-400/80 focus-visible:ring-sky-400"
                placeholder="0,00"
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>
            <Button className="bg-sky-400/80 hover:bg-sky-400 text-black mt-auto">
              Create
            </Button>
          </form>
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
                {filteredProducts.map((product, index) => (
                  <div
                    className="flex w-full px-5 py-2 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    key={product.id}
                  >
                    <p className="w-10 text-center flex-none">{index + 1}</p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      {product.new_barcode_product ||
                        product.old_barcode_product}
                    </p>
                    <p className="w-full whitespace-pre-wrap">
                      {product.new_name_product}
                    </p>
                    <div className="w-24 flex-none flex gap-4 justify-center">
                      <Button
                        className="items-center border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                        variant={"outline"}
                        type="button"
                        onClick={() => deleteFilteredProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <div>Delete</div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="w-full flex justify-between items-center">
              <p className="text-sm">Total Product: {filteredTotalProducts}</p>
              <div className="flex gap-5 items-center">
                <p className="text-sm">
                  Page {filteredPage} of {filteredTotalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() =>
                      setFilteredPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={filteredPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                    onClick={() =>
                      setFilteredPage((prev) =>
                        Math.min(prev + 1, filteredTotalPages)
                      )
                    }
                    disabled={filteredPage === filteredTotalPages}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className="w-full">
                {products.map((product, index) => (
                  <div
                    className="flex w-full px-5 py-2 text-sm gap-4 border-b border-sky-100 items-center hover:border-sky-200"
                    key={product.id}
                  >
                    <p className="w-10 text-center flex-none">{index + 1}</p>
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
                      })()}
                    </p>

                    <p className="w-full whitespace-pre-wrap">
                      {product.new_name_product}
                    </p>
                    <p className="w-44 flex-none">
                      {product.new_category_product
                        ? product.new_category_product
                        : product.new_tag_product}
                    </p>
                    <p className="w-32 flex-none">
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
                        onClick={() => addProductToBundle(product.id)}
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        <div>Add</div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm">Total Product: {totalProducts}</p>
            <div className="flex gap-5 items-center">
              <p className="text-sm">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
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
