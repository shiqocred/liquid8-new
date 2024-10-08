import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";

const ScanResultApprovePage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default ScanResultApprovePage;
