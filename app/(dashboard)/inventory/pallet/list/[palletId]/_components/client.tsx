"use client";

import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import CreateClient from "./create-client";
import DetailClient from "./detail-client";
import Loading from "../loading";

export const Client = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  if (params.palletId === "create") {
    return <CreateClient />;
  }

  return <DetailClient />;
};
