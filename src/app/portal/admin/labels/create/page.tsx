import React from "react";
import { getTranslations } from "next-intl/server";
import CreateLabelPage from "@/components/pages/admin/labels/CreateLabelPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.labels" });

  return {
    title: t("createLabel"),
  };
}

export default function CreateLabel() {
  return <CreateLabelPage />;
}
