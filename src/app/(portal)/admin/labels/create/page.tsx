import React from "react";
import { getTranslations } from "next-intl/server";
import CreateLabelPage from "@/components/admin/labels/pages/CreateLabelPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Label",
};

export default function CreateLabel() {
  return <CreateLabelPage />;
}
