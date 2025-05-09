"use client";
import { useZap } from "@/hooks/useZap";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import SidebarConfig from "@/components/SidebarConfig";
import { useState, useEffect } from "react";
import { getZapStage } from "@/helpers/zapConfigStage";
import WorkflowNode from "@/components/WorkflowNode";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ZapPage({ params }: PageProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const { id } = params;

  if (!id) {
    notFound();
  }

  const { data: zap, isLoading, error } = useZap(id);
  console.log("this thsi ", zap);

  useEffect(() => {
    console.log("under effect ", zap);

    if (!isLoading && !error && zap) {
      if (zap.trigger) {
        const stage = getZapStage(zap.trigger);

        console.log("stage ho yo", stage);
        setStep(stage);
      } else {
        setStep(1);
      }
    }
  }, [isLoading, error, zap, showSidebar]);

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

      {/* Show trigger information if it exists */}
      {zap?.trigger ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Trigger</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Type:</span>
            <span className="text-sm font-medium">{zap.trigger.type.name}</span>
          </div>
        </div>
      ) : (
        // Show trigger setup if no trigger exists
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
          <h3 className="font-medium text-gray-700 mb-2">
            Start with a Trigger
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Select an app to trigger your workflow
          </p>
          <Button onClick={handleSetTrigger}>Set Trigger</Button>
        </div>
      )}

      {/* Show workflows if trigger exists */}
      {zap?.trigger && (
        <>
          {zap.workflows && zap.workflows.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Workflows</h3>
              <div className="space-y-4">
                {zap.workflows.map((workflow, index) => (
                  <WorkflowNode
                    key={workflow.id}
                    type="workflow"
                    app={workflow.type.name}
                    title={"this is the workflow title"}
                    description={"this is the workflow description"}
                    status={workflow.done ? "complete" : "incomplete"}
                    onClick={() => setShowSidebar(true)}
                    onAddAction={() => {
                      console.log("add action");
                    }}
                    isLast={index === zap.workflows.length - 1}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Show this when there are no workflows but trigger exists
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
              <h3 className="font-medium text-gray-700 mb-2">
                Add Your First Action
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Select an app to add an action to your workflow
              </p>
              <Button onClick={() => setShowSidebar(true)}>Add Action</Button>
            </div>
          )}
        </>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        {showSidebar && (
          <SidebarConfig
            zapId={id}
            type={zap?.trigger ? "workflow" : "trigger"}
            onClose={() => setShowSidebar(false)}
            onBack={() => setShowSidebar(false)}
            step={step}
            onComplete={() => {
              setStep(step + 1);
              setShowSidebar(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
