import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";
import { Metadata } from "next";
import { baseUrl } from "@/lib/baseUrl";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ repairId: string }>;
}): Promise<Metadata> {
  const repairId = (await params).repairId;

  let titlePage = "";

  const accessToken = cookies().get("accessToken")?.value;

  if (repairId !== "create") {
    const res = await fetch(`${baseUrl}/repair-mv/${repairId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      titlePage = "Detail Repair";
    } else {
      titlePage = "Not Found";
    }
  } else {
    titlePage = "Create Repair";
  }

  return {
    title: titlePage,
  };
}

const DetailRepairPage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default DetailRepairPage;
