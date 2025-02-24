import React from "react";
import LabelsListPage from "@/components/admin-components/labels/pages/ListLabelPage";
import UnlinkedReportsPage from "@/components/admin-components/reports/unlinked/pages/UnlinkedReportsPage";

export const metadata = {
  title: "Link Missing Reports",
};

export default function LabelsList() {
  return <UnlinkedReportsPage />;
}
