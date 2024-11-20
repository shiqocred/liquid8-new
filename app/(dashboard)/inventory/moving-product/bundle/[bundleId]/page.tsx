import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";

import { Metadata } from "next";
import { baseUrl } from "@/lib/baseUrl";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bundleId: string }>;
}): Promise<Metadata> {
  const bundleId = (await params).bundleId;

  let titlePage = "";

  const accessToken = cookies().get("accessToken")?.value;

  if (bundleId !== "create") {
    const res = await fetch(`${baseUrl}/bundle/${bundleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      titlePage = "Detail Bundle";
    } else {
      titlePage = "Not Found";
    }
  } else {
    titlePage = "Create Bundle";
  }

  return {
    title: titlePage,
  };
}

const DetailBundlePage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default DetailBundlePage;
