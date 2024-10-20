import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulking Product",
};

const BulkingProductPage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default BulkingProductPage;
