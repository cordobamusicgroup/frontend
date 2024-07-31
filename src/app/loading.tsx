"use client";

import dynamic from "next/dynamic";

const FullScreenLoader = dynamic(() => import("@/components/molecules/loaders/FullScreenLoader"), { ssr: false });

export default function Loading() {
  return <FullScreenLoader open={true} />;
}
