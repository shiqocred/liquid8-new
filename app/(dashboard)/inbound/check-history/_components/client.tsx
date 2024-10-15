"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { baseUrl } from "@/lib/baseUrl";
import { useModal } from "@/hooks/use-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { TooltipProviderPage } from "@/providers/tooltip-provider-page";

import {
  ChevronLeft,
  ChevronRight,
  Loader,
  ReceiptText,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import qs from "query-string";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Loading from "../loading";

export const Client = () => {
  // core
  const router = useRouter();
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

  // cookies
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // state boolean
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // state search
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);

  // state data
  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: parseFloat(searchParams.get("page") ?? "1") ?? 1, //page saat ini
    last: 1, //page terakhir
    from: 1, //data dimulai dari (untuk memulai penomoran tabel)
    total: 1, //total data
  });

  // handle GET
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/historys?page=${page.current}&q=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setHistory(response.data.data.resource.data);
      setPage({
        current: response.data.data.resource.current_page,
        last: response.data.data.resource.last_page,
        from: response.data.data.resource.from,
        total: response.data.data.resource.total,
      });
    } catch (err: any) {
      toast.error(`Error ${err.response.status}: Something went wrong`);
      console.log("ERROR_GET_DOCUMENT:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle search params
  const handleCurrentId = useCallback(
    (q: string, page: number) => {
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        page: page,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!page || page <= 1) {
        delete updateQuery.page;
      }

      const url = qs.stringifyUrl(
        {
          url: "/inbound/check-history/",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    handleCurrentId(searchValue, page.current);
    fetchDocuments();
  }, [searchValue, page.current]);

  useEffect(() => {
    setIsMounted(true);
    fetchDocuments();
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Inbound</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Check History</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow px-5 py-3 gap-10 flex-col">
        <h2 className="text-xl font-bold">List Check History</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-2 items-center w-full">
            <Input
              className="w-2/5 border-sky-400/80 focus-visible:ring-sky-400"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <div className="w-full p-4 rounded-md border border-sky-400/80">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <ScrollArea>
                <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-3 font-semibold items-center hover:bg-sky-200/80">
                  <p className="w-10 text-center flex-none">No</p>
                  <p className="w-full min-w-72 max-w-[500px]">Data Name</p>
                  <p className="w-56 flex-none">Date</p>
                  <p className="w-32 flex-none">Total Items</p>
                  <p className="w-32 flex-none">Total In</p>
                  <p className="w-28 flex-none">Status Approve</p>
                  <p className="w-24 flex-none text-center">Action</p>
                </div>
                {history.map((item, i) => (
                  <div
                    className="flex w-full px-5 py-3 text-sm gap-3 border-b border-sky-200 items-center hover:border-sky-300"
                    key={item.id}
                  >
                    <p className="w-10 text-center flex-none">
                      {page.from + i}
                    </p>
                    <p className="w-full min-w-72 max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.base_document}
                    </p>
                    <p className="w-56 flex-none overflow-hidden text-ellipsis">
                      {format(new Date(item.created_at), "iiii, dd-MMM-yyyy")}
                    </p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      {item.total_data.toLocaleString()}
                    </p>
                    <p className="w-32 flex-none overflow-hidden text-ellipsis">
                      {item.total_data_in.toLocaleString()}
                    </p>
                    <div className="w-28 flex-none">
                      <Badge
                        className={cn(
                          "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400"
                        )}
                      >
                        {item.status_approve}
                      </Badge>
                    </div>
                    <div className="w-24 flex-none flex gap-4 justify-center">
                      <TooltipProviderPage value="Detail">
                        <Link
                          href={`/inbound/check-history/${item.id}`}
                          className="w-9 flex-none"
                        >
                          <Button
                            className="items-center w-full px-0  border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
                            variant={"outline"}
                          >
                            <ReceiptText className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipProviderPage>
                      <TooltipProviderPage value="Delete">
                        <Button
                          className="items-center px-0  border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50 w-9"
                          variant={"outline"}
                          type="button"
                          onClick={() =>
                            onOpen("delete-manifest-inbound", item.id)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipProviderPage>
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
                  onClick={() =>
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
                  }
                  disabled={page.current === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  className="p-0 h-9 w-9 bg-sky-400/80 hover:bg-sky-400 text-black"
                  onClick={() =>
                    setPage((prev) => ({ ...prev, current: prev.current - 1 }))
                  }
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

{
  /* <div className="w-full p-4 rounded-md border border-sky-400/80">
  <div className="flex w-full px-5 py-3 bg-sky-100 rounded text-sm gap-2 font-semibold items-center hover:bg-sky-200/80">
    <p className="w-10 text-center flex-none">No</p>
    <p className="xl:w-40 w-32 flex-none">Document Code</p>
    <p className="xl:w-44 w-36 flex-none">Date</p>
    <p className="xl:w-24 w-20 flex-none">Total Data</p>
    <p className="xl:w-24 w-20 flex-none">Total In</p>
    <p className="w-28 flex-none">Status Check</p>
    <p className="w-32 flex-none">Status Approved</p>
    <p className="w-full text-center">Action</p>
  </div>
  {history.map((item, i) => (
    <div
      className="flex w-full px-5 py-5 text-sm gap-2 border-b border-sky-100 items-center hover:border-sky-200"
      key={item.id}
    >
      <p className="w-10 text-center flex-none">{i + 1}</p>
      <p className="xl:w-40 w-32 flex-none">{item.code_document}</p>
      <p className="xl:w-44 w-36 flex-none">{formatDate(item.created_at)}</p>
      <p className="xl:w-24 w-20 flex-none">{item.total_data}</p>
      <p className="xl:w-24 w-20 flex-none">{item.total_data_in}</p>
      <div className="w-28 flex-none">
        <Badge
          className={cn(
            "rounded w-20 px-0 justify-center text-black font-normal capitalize bg-green-400 hover:bg-green-400"
          )}
        >
          Done
        </Badge>
      </div>
      <div className="w-32 flex-none">
        <Badge
          className={cn(
            "rounded w-20 px-0 justify-center text-black font-normal capitalize",
            item.status_approve === "pending" &&
              "bg-gray-200 hover:bg-gray-200",
            item.status_approve === "in progress" &&
              "bg-yellow-400 hover:bg-yellow-400",
            item.status_approve === "done" && "bg-green-400 hover:bg-green-400"
          )}
        >
          {item.status_approve.charAt(0).toUpperCase() +
            item.status_approve.slice(1)}
        </Badge>
      </div>
      <div className="w-full flex gap-4 justify-center">
        <Link href={"/inbound/check-history/1"} className="w-9">
          <TooltipProviderPage value={<p>Detail</p>}>
            <Button
              className="items-center w-9 px-0 flex-none h-9 border-sky-400 text-sky-700 hover:text-sky-700 hover:bg-sky-50"
              variant={"outline"}
            >
              <ReceiptText className="w-4 h-4" />
            </Button>
          </TooltipProviderPage>
        </Link>
        <TooltipProviderPage value={<p>Delete</p>}>
          <Button
            className="items-center w-9 px-0 flex-none h-9 border-red-400 text-red-700 hover:text-red-700 hover:bg-red-50"
            variant={"outline"}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipProviderPage>
      </div>
    </div>
  ))}
</div>; */
}
