"use client";

import { useZaps } from "@/hooks/useZaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Workflow } from "@/types";

type WorkflowWithZapName = Workflow & { zapName: string };

export function WorkflowList() {
  const { data, isLoading, isError, error } = useZaps(20);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading workflows...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading workflows: {error.message}
      </div>
    );
  }

  // Extract all workflows from all zaps and add zapName
  const allWorkflows: WorkflowWithZapName[] = data?.pages.flatMap((page) =>
    page.zaps.flatMap((zap) =>
      zap.workflows.map((workflow) => ({
        ...workflow,
        zapName: zap.name,
      }))
    )
  ) || [];

  // Sort by index for consistency
  allWorkflows.sort((a, b) => a.index - b.index);

  if (allWorkflows.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No workflows found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allWorkflows.map((workflow) => (
        <Card key={workflow.id} className="h-full transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {workflow.type.name}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Part of: {workflow.zapName}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md overflow-hidden">
                <img
                  src={workflow.type.image}
                  alt={workflow.type.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">{workflow.type.name}</div>
                {workflow.type.subType && (
                  <div className="text-xs text-muted-foreground">
                    {workflow.type.subType}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 