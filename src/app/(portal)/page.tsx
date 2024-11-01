import PageOverview from "@/components/global/pages/PageOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Overview() {
  return <PageOverview />;
}
