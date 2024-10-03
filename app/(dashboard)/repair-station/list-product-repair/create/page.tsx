import React, { Suspense } from "react";
import Loading from "./loading";
import Client from "./_components/client";

const CreateRepairPage = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </div>
  );
};

export default CreateRepairPage;
