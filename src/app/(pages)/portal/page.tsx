import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import PageOverview from "@/components/templates/PageOverview";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.pages.overview"),
  };
}

export default function Overview() {
  return <PageOverview />;
}
