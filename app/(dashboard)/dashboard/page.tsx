import { redirect } from "next/navigation";
import React from "react";

const AnalyticPage = () => {
  return redirect("/dashboard/storage-report");
};

export default AnalyticPage;
