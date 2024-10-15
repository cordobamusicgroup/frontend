import React from "react";
import { Metadata } from "next";
import UpdateLabelPage from "@/components/admin/labels/pages/UpdateLabelPage";

export const metadata: Metadata = {
  title: "Update Label",
};

export default function EditLabel({ params }: { params: { labelId: string } }) {
  return <UpdateLabelPage labelId={params.labelId} />;
}
