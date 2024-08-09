import React from "react";
import PortalPageLayout from "./layout";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Portal() {
  return (
    <>
      <div>Welcome to Overview!</div>
    </>
  );
}
