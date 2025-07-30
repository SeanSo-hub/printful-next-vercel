"use client";

import { useSearchParams } from "next/navigation";
import PrintfulEDM from "@/components/PrintfulEDM";

export default function EDMPage() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId"));

  if (!productId) {
    return <div className="p-8 text-red-600">No productId provided.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Customize Your Product</h1>
      <PrintfulEDM productId={productId} />
    </div>
  );
}
