import React, { Suspense } from "react";
import { Client } from "./_components/client";
import Loading from "./loading";

const ManualInboundPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default ManualInboundPage;
