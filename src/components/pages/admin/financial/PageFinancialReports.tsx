"use client";
import React from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";
import { useTranslations } from "next-intl";

const PageFinancialReports: React.FC = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const title = t("menus.financial.reports");
  dispatch(setPageTitle(title));

  return <div>Welcome to Córdoba Music Group!</div>;
};

export default PageFinancialReports;
