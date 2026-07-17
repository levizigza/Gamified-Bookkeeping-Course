"use client";

import { useState } from "react";
import { DepreciationCalculatorPanel } from "@/components/calculators/DepreciationCalculatorPanel";
import { EducationalDisclaimer } from "@/components/calculators/EducationalDisclaimer";
import { HomeOfficeCalculatorPanel } from "@/components/calculators/HomeOfficeCalculatorPanel";
import { MileageCalculatorPanel } from "@/components/calculators/MileageCalculatorPanel";
import { Card, CardTitle } from "@/components/ui/Card";

const TABS = [
  { id: "depreciation", label: "Depreciation" },
  { id: "home-office", label: "Home Office" },
  { id: "mileage", label: "Mileage" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function YearEndCalculators() {
  const [activeTab, setActiveTab] = useState<TabId>("depreciation");

  return (
    <div className="space-y-6">
      <EducationalDisclaimer />

      <div
        className="flex flex-wrap gap-2 border-b border-ledger-200 pb-4"
        role="tablist"
        aria-label="Year-end calculators"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-ledger-600 text-white"
                : "bg-ledger-100 text-ledger-700 hover:bg-ledger-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding="lg">
        <CardTitle className="text-xl">
          {TABS.find((t) => t.id === activeTab)?.label} Calculator
        </CardTitle>
        <div className="mt-6" role="tabpanel">
          {activeTab === "depreciation" && <DepreciationCalculatorPanel />}
          {activeTab === "home-office" && <HomeOfficeCalculatorPanel />}
          {activeTab === "mileage" && <MileageCalculatorPanel />}
        </div>
      </Card>
    </div>
  );
}
