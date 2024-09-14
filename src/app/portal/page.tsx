import { getTranslations } from "next-intl/server";
import PageOverview from "@/components/pages/PageOverview";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.overview" });

  return {
    title: t("title"),
  };
}

export default function Overview() {
  return <PageOverview />;
}
