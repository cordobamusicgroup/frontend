import React from "react";
import CreateLabelPage from "@/components/admin-components/labels/pages/CreateLabelPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Label",
};

export default function CreateLabel() {
  return <CreateLabelPage />;
}
