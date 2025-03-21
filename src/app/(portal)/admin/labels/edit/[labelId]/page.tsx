import React from "react";
import { Metadata } from "next";
import UpdateLabelPage from "@/components/admin-components/labels/pages/UpdateLabelPage";

export const metadata: Metadata = {
  title: "Edit Label",
};

export default async function EditLabel(props: { params: Promise<{ labelId: string }> }) {
  const params = await props.params;
  return <UpdateLabelPage labelId={params.labelId} />;
}
