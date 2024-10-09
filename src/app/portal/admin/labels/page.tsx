import React from "react";
import { getTranslations } from "next-intl/server";
import LabelsListPage from "@/components/pages/admin/labels/LabelsListPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.labels" });

  return {
    title: t("title"),
  };
}

export default function LabelsList() {
  return <LabelsListPage />;
}
