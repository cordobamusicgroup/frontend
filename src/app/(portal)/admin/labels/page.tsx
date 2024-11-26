import React from "react";
import LabelsListPage from "@/components/admin/labels/pages/ListLabelPage";

export const metadata = {
  title: "Labels List",
  description: "Manage your labels here",
};

export default function LabelsList() {
  return <LabelsListPage />;
}
