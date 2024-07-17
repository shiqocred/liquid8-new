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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { ArrowLeft, Search, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import BarcodePrinted from "@/components/barcode";
import { formatRupiah } from "@/lib/utils";

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const searchValue = useDebounce(dataSearch);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("f") ?? "");
  const [orientation, setOrientation] = useState(searchParams.get("s") ?? "");
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000); // Reset the icon after 2 seconds
    });
  };

  const handleCurrentId = useCallback(
    (q: string, f: string, s: string) => {
      setFilter(f);
      setOrientation(s);
      let currentQuery = {};

      if (searchParams) {
        currentQuery = qs.parse(searchParams.toString());
      }

      const updateQuery: any = {
        ...currentQuery,
        q: q,
        f: f,
        s: s,
      };

      if (!q || q === "") {
        delete updateQuery.q;
      }
      if (!f || f === "") {
        delete updateQuery.f;
        setFilter("");
      }
      if (!s || s === "") {
        delete updateQuery.s;
        setOrientation("");
      }

      const url = qs.stringifyUrl(
        {
          url: "/inbound/check-product/manifest-inbound/check",
          query: updateQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    },
    [searchParams, router]
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

  useEffect(() => {
    handleCurrentId(searchValue, filter, orientation);
  }, [searchValue]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col items-start bg-gray-100 w-full relative px-4 gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inbound/check-product/manifest-inbound/">
              Manifest Inbound
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Check</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex text-sm text-gray-500 py-6 rounded-md shadow bg-white w-full px-5 gap-4 items-center relative">
        <div className="w-full text-xs flex items-center">
          <Link
            href={"/inbound/check-product/manifest-inbound/detail"}
            className="group"
          >
            <button
              type="button"
              className="flex items-center text-black group-hover:mr-6 mr-4 transition-all w-auto"
            >
              <div className="w-10 h-10 rounded-full group-hover:shadow justify-center flex items-center group-hover:bg-gray-100 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </button>
          </Link>
          <div className="w-2/3">
            <p>Data Name</p>
            <h3 className="text-black font-semibold text-xl">0096/07/2024</h3>
          </div>
        </div>
        <Separator orientation="vertical" className="h-16 bg-gray-500" />
        <div className="w-full flex-col flex gap-1">
          <Label className="text-xs">Search Barcode Product</Label>
          <div className="flex">
            <Input
              className="w-full border-sky-400/80 focus-visible:ring-sky-400 rounded-r-none"
              value={dataSearch}
              onChange={(e) => setDataSearch(e.target.value)}
              placeholder="Search..."
            />
            <Button className="rounded-l-none flex-none p-0 w-9 bg-sky-400/80 hover:bg-sky-400 text-black">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center">
        <div className="w-full flex gap-2">
          <p>Keterangan:</p>
          <p>&gt; 100K</p>
        </div>
        <div className="w-full flex justify-end">
          <Button className="bg-sky-400/80 hover:bg-sky-400 text-black">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Done Check All
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-full">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">Old Data</h2>
            <div className="flex w-full items-center gap-4 flex-col">
              <div className="w-full flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <Label>Barcode</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Label>Name</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-full gap-1">
                  <Label>Price</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Label>Qty</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 flex-col">
            <h2 className="text-xl font-bold">New Data</h2>
            <div className="flex w-full items-center gap-4 flex-col">
              <div className="flex flex-col w-full gap-1">
                <Label>Name</Label>
                <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
              </div>
              <div className="w-full flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <Label>Price</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Label>Qty</Label>
                  <Input className="w-full border-sky-400/80 focus-visible:ring-sky-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-md overflow-hidden shadow p-5 gap-6 items-center">
        <Tabs defaultValue="good" className="w-full">
          <div className="w-full flex justify-center">
            <TabsList className="bg-sky-100">
              <TabsTrigger className="w-32" value="good">
                Good
              </TabsTrigger>
              <TabsTrigger className="w-32" value="damaged">
                Damaged
              </TabsTrigger>
              <TabsTrigger className="w-32" value="abnormal">
                Abnormal
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="good">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex w-full gap-4"
                        >
                          <div className="flex flex-col gap-6 w-full">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="all" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mentions" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                          </div>
                          <div className="flex flex-col gap-6 w-full">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="all" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mentions" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                          </div>
                          <div className="flex flex-col gap-6 w-full">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="all" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mentions" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                          </div>
                          <div className="flex flex-col gap-6 w-full">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="all" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mentions" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-1">
                                <p className="font-bold">All new messages</p>
                                <p className="text-xs font-light">50%</p>
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="damaged">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description:</FormLabel>
                      <Textarea
                        rows={6}
                        className="border-sky-400/80 focus-visible:ring-sky-400"
                      />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="abnormal">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description:</FormLabel>
                      <Textarea
                        rows={6}
                        className="border-sky-400/80 focus-visible:ring-sky-400"
                      />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-400/80 hover:bg-sky-400 text-black"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        {/* <BarcodePrinted
          barcode="LQC12345"
          category="TOYS HOBBIES (200-699)"
          newPrice={formatRupiah(20000) ?? ""}
          oldPrice={formatRupiah(10000) ?? ""}
        /> */}
      </div>
    </div>
  );
};
