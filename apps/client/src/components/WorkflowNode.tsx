import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowNodeProps {
  type: "trigger" | "workflow";
  app: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status: "incomplete" | "complete" | "error";
  onClick?: () => void;
  onAddAction?: () => void;
  isLast?: boolean;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  type,
  app,
  title,
  description,
  icon,
  status,
  onClick,
  onAddAction,
  isLast = false,
}) => {
  return (
    <div className="relative group">
      {/* Step connector line */}
      {!isLast && <div className="step-line" />}

      <Card
        className={cn(
          "border rounded-lg p-4 mb-2 cursor-pointer transition-all hover:shadow-md",
          status === "incomplete"
            ? "border-gray-300 bg-white"
            : status === "complete"
              ? "border-green-200 bg-white"
              : "border-red-200 bg-white"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              status === "incomplete"
                ? "bg-gray-100 text-gray-400"
                : status === "complete"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
            )}
          >
            {status === "complete" ? (
              <Check size={20} />
            ) : status === "error" ? (
              <AlertCircle size={20} />
            ) : (
              icon || (type === "trigger" ? "T" : "A")
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                {app}
              </Badge>
              <Badge
                variant={type === "trigger" ? "secondary" : "outline"}
                className="text-xs"
              >
                {type === "trigger" ? "Trigger" : "Action"}
              </Badge>
            </div>
            <h3 className="font-medium mt-1">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>

          <ChevronRight className="text-gray-400" size={18} />
        </div>
      </Card>

      {/* Add action button */}
      {onAddAction && (
        <div className="relative flex justify-center my-4">
          <button
            onClick={onAddAction}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;
