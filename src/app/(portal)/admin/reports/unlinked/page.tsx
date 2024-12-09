import React from "react";
import LabelsListPage from "@/components/admin/labels/pages/ListLabelPage";
import UnlinkedReportsPage from "@/components/admin/reports/unlinked/pages/UnlinkedReportsPage";

export const metadata = {
  title: "Link Missing Reports",
};

export default function LabelsList() {
  return <UnlinkedReportsPage />;
}
