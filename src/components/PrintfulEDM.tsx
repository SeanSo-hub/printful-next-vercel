"use client";
import { useEffect, useRef } from "react";

export default function PrintfulEDM({
  productId,
  variantId,
  templateId,
}: {
  productId: number;
  variantId: number;
  templateId: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById("printful-embedd-script")) {
      const script = document.createElement("script");
      script.id = "printful-embedd-script";
      script.src = "https://static.printful.com/static/designer/embedded.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    function openEDM() {
      if (window.PrintfulEmbedded && containerRef.current) {
        window.PrintfulEmbedded.open({
          productId,
          variantId,
          templateId,
          container: containerRef.current,
        });
      }
    }
    if (window.PrintfulEmbedded) {
      openEDM();
    } else {
      const interval = setInterval(() => {
        if (window.PrintfulEmbedded) {
          openEDM();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [productId, variantId, templateId]);

  return <div ref={containerRef} style={{ width: "100%", minHeight: 600 }} />;
}
