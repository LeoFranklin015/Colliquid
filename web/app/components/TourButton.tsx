"use client";

import { usePathname } from "next/navigation";
import { useNextStep } from "nextstepjs";
import { HelpCircle } from "lucide-react";

const pageTours: Record<string, string> = {
  "/dashboard": "bank-portfolio",
  "/marketplace": "marketplace",
  "/ai": "ai-evaluation",
};

export default function TourButton() {
  const pathname = usePathname();
  const { startNextStep } = useNextStep();

  const tourName = pageTours[pathname];
  if (!tourName) return null;

  return (
    <button
      onClick={() => startNextStep(tourName)}
      title="Start guided tour"
      className="cursor-pointer rounded-lg border border-border p-1.5 text-muted transition-colors hover:text-foreground hover:border-foreground/20"
    >
      <HelpCircle size={16} />
    </button>
  );
}
