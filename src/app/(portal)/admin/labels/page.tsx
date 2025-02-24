import React from "react";
import LabelsListPage from "@/components/admin-components/labels/pages/ListLabelPage";

export const metadata = {
  title: "Labels List",
  description: "Manage your labels here",
};

export default function LabelsList() {
  return <LabelsListPage />;
}
