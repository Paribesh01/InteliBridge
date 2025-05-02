"use client";
import { useZap } from "@/hooks/useZap";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import SidebarConfig from "@/components/SidebarConfig";
import { useState } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ZapPage({ params }: PageProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const { id } = params;

  if (!id) {
    notFound();
  }

  const { data: zap, isLoading, error } = useZap(id);
  console.log(zap);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSetTrigger = () => {
    setShowSidebar(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create a New Workflow</h1>
        <p className="text-gray-600">
          Build your automation workflow by connecting triggers and actions
        </p>
      </div>
      {!zap?.trigger && (
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <h3 className="font-medium text-gray-700 mb-2">
            Start with a Trigger
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Select an app to trigger your workflow
          </p>
          <Button onClick={handleSetTrigger}>Set Trigger</Button>
        </div>
      )}

      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        {showSidebar && (
          <SidebarConfig
            zapId={id}
            type={"trigger"}
            onClose={() => {}}
            onBack={() => {}}
            step={1}
            onComplete={() => {}}
          />
        )}
      </div>
    </div>
  );
}
