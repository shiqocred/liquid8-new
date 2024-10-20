import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const AnalyticPage = () => {
  return redirect("/dashboard/storage-report");
};

export default AnalyticPage;
