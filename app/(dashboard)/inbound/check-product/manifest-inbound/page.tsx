import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifest Inbound",
};

const ManifestInboundPage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default ManifestInboundPage;
