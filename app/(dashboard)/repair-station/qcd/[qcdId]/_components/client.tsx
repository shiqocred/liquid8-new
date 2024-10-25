"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateClient from "./create-client";
import DetailClient from "./detail-client";
import Loading from "../loading";

export const Client = () => {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  if (params.qcdId === "create") {
    return <CreateClient />;
  }

  return <DetailClient />;
};
