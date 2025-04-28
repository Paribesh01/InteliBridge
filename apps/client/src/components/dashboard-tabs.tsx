"use client";

import { useState } from "react";
import { ZapList } from "@/components/zap-list";
import { WorkflowList } from "@/components/workflow-list";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<"zaps" | "workflows">("zaps");

  return (
    <div>
      {/* Tab navigation */}
      <div className="border-b mb-8">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("zaps")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "zaps"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Zaps
          </button>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "workflows"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Workflows
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "zaps" ? <ZapList /> : <WorkflowList />}
    </div>
  );
} 