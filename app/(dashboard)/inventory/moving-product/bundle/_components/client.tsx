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
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { baseUrl } from "@/lib/baseUrl";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  PackageOpen,
  PlusCircle,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import qs from "query-string";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import { useModal } from "@/hooks/use-modal";

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
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state search & filter
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");

  // state data
  const [bundles, setBundles] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });
  const [error, setError] = useState<string | null>(null);

  // handle GET Data
  const fetchBundles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/bundle?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBundles(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      console.log("ERROR_GET_BUNDLES:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (accessToken) {
  //     fetchCategory(page, searchValue);
  //   }
  // }, [searchValue, page, fetchCategory, accessToken]);

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
          url: "/inventory/moving-product/bundle",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  // effect update search & page
  useEffect(() => {
    handleCurrentId(searchValue, filter, 1);
    fetchBundles();
  }, [searchValue]);

  // effect update when...
  useEffect(() => {
    if (cookies.get("bundle")) {
      handleCurrentId(searchValue, filter, page.current);
      fetchBundles();
      return cookies.remove("bundle");
    }
  }, [cookies.get("bundle"), searchValue, page.current]);

  useEffect(() => {
    setIsMounted(true);
    fetchBundles();
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
          <BreadcrumbItem>Inventory</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Moving Product</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Bundle</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Bundle</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full justify-between">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex gap-4">
              <Link href="/inventory/moving-product/bundle/create">
                <Button className="bg-sky-400 hover:bg-sky-400/80 text-black">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Bundle
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-32 flex-none">Barcode Bundle</p>
                  <p className="w-full min-w-72">Bundle Name</p>
                  <p className="w-20 flex-none">Qty</p>
                  <p className="w-40 flex-none">Total Price</p>
                  <p className="w-28 flex-none">Status</p>
                  <p className="w-52 text-center flex-none">Action</p>
                </div>
                {bundles.map((bundle, i) => (
                  <div
                    className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
                    key={bundle.id}
                  >
                    <p className="w-10 text-center flex-none">
                      {page.from + i}
                    </p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      {bundle.barcode_bundle}
                    </p>
                    <p className="w-full min-w-72 whitespace-pre-wrap">
                      {bundle.name_bundle}
                    </p>
                    <p className="w-20 flex-none whitespace-pre-wrap">
                      {bundle.total_product_bundle}
                    </p>
                    <p className="w-40 flex-none whitespace-pre-wrap">
                      {formatRupiah(bundle.total_price_bundle)}
                    </p>
                    <div className="w-28 flex-none">
                      <Badge className="rounded w-20 px-0 justify-center text-black font-normal capitalize bg-sky-400 hover:bg-sky-400">
                        {bundle.product_status}
                      </Badge>
                    </div>
                    <div className="w-52 flex-none flex gap-4 justify-center">
                      <Link href={`/inventory/moving-product/bundle/${i + 1}`}>
                        <Button
                          className="items-center w-full border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                          variant={"outline"}
                          type="button"
                        >
                          <ReceiptText className="w-4 h-4 mr-1" />
                          <p>Detail</p>
                        </Button>
                      </Link>
                      <Button
                        className="items-center w-full border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
                        variant={"outline"}
                        type="button"
                        onClick={() => alert("pop up")}
                      >
                        <PackageOpen className="w-4 h-4 mr-1" />
                        <p>Unbundle</p>
                      </Button>
                    </div>
                  </div>
                ))}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
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
                    cookies.set("bundle", "remove");
                  }}
                  disabled={page.current === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() => {
                    setPage((prev) => ({ ...prev, current: prev.current + 1 }));
                    cookies.set("bundle", "add");
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
