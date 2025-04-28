"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTriggers } from "@/hooks/useTriggers";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useCreateZap } from "@/hooks/useCreateZap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AvailableTrigger, AvailableWorkflow } from "@/types";
import { Loader2, ArrowRight } from "lucide-react";

enum ZapCreationStep {
  TRIGGER = 0,
  WORKFLOW = 1,
  DETAILS = 2,
  CONFIRMATION = 3,
}

export function CreateZapForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ZapCreationStep>(ZapCreationStep.TRIGGER);
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>("");
  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);
  const [zapName, setZapName] = useState<string>("");
  const [zapDescription, setZapDescription] = useState<string>("");
  
  const { data: triggersData, isLoading: isLoadingTriggers } = useTriggers();
  const { data: workflowsData, isLoading: isLoadingWorkflows } = useWorkflows();
  const { mutate: createZap, isPending, isError, error } = useCreateZap();

  const handleSelectTrigger = (triggerId: string) => {
    setSelectedTriggerId(triggerId);
  };

  const handleSelectWorkflow = (workflowId: string) => {
    if (selectedWorkflowIds.includes(workflowId)) {
      setSelectedWorkflowIds(
        selectedWorkflowIds.filter((id) => id !== workflowId)
      );
    } else {
      setSelectedWorkflowIds([...selectedWorkflowIds, workflowId]);
    }
  };

  const handleNext = () => {
    if (currentStep < ZapCreationStep.CONFIRMATION) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > ZapCreationStep.TRIGGER) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    createZap(
      {
        name: zapName,
        description: zapDescription,
        triggerId: selectedTriggerId,
        workflowIds: selectedWorkflowIds,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
        },
      }
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ZapCreationStep.TRIGGER:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose a Trigger</h2>
            <p className="text-sm text-muted-foreground">
              Select an event that will start your automation
            </p>
            
            {isLoadingTriggers ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RadioGroup
                value={selectedTriggerId}
                onValueChange={handleSelectTrigger}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                {triggersData?.triggers.map((trigger: AvailableTrigger) => (
                  <div key={trigger.id} className="relative">
                    <RadioGroupItem
                      value={trigger.id}
                      id={trigger.id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={trigger.id}
                      className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                        selectedTriggerId === trigger.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10">
                        <img
                          src={trigger.image}
                          alt={trigger.name}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{trigger.name}</p>
                        {trigger.subType && (
                          <p className="text-sm text-muted-foreground">
                            {trigger.subType}
                          </p>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        );

      case ZapCreationStep.WORKFLOW:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose Workflows</h2>
            <p className="text-sm text-muted-foreground">
              Select one or more actions to perform when the trigger is activated
            </p>
            
            {isLoadingWorkflows ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {workflowsData?.workflows.map((workflow: AvailableWorkflow) => (
                  <div
                    key={workflow.id}
                    className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                      selectedWorkflowIds.includes(workflow.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectWorkflow(workflow.id)}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10">
                      <img
                        src={workflow.image}
                        alt={workflow.name}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      {workflow.subType && (
                        <p className="text-sm text-muted-foreground">
                          {workflow.subType}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case ZapCreationStep.DETAILS:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Name Your Zap</h2>
            <p className="text-sm text-muted-foreground">
              Give your automation a name and description
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zap-name">Name (required)</Label>
                <Input
                  id="zap-name"
                  placeholder="e.g., Email Notifications"
                  value={zapName}
                  onChange={(e) => setZapName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zap-description">Description (optional)</Label>
                <Textarea
                  id="zap-description"
                  placeholder="What does this Zap do?"
                  rows={3}
                  value={zapDescription}
                  onChange={(e:any) => setZapDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case ZapCreationStep.CONFIRMATION:
        const selectedTrigger = triggersData?.triggers.find(
          (t) => t.id === selectedTriggerId
        );
        const selectedWorkflows = workflowsData?.workflows.filter((w) =>
          selectedWorkflowIds.includes(w.id)
        );

        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Review Your Zap</h2>
            <p className="text-sm text-muted-foreground">
              Confirm the details of your automation
            </p>
            
            <Card className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{zapName}</p>
              </div>
              
              {zapDescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{zapDescription}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trigger</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedTrigger && (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10">
                        <img
                          src={selectedTrigger.image}
                          alt={selectedTrigger.name}
                          className="w-4 h-4"
                        />
                      </div>
                      <p>{selectedTrigger.name}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workflows</p>
                <div className="space-y-2 mt-1">
                  {selectedWorkflows?.map((workflow) => (
                    <div key={workflow.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10">
                        <img
                          src={workflow.image}
                          alt={workflow.name}
                          className="w-4 h-4"
                        />
                      </div>
                      <p>{workflow.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {isError && (
              <div className="rounded-md p-3 bg-destructive/10 text-destructive">
                <p className="text-sm font-medium">Error: {error?.message}</p>
              </div>
            )}
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case ZapCreationStep.TRIGGER:
        return !!selectedTriggerId;
      case ZapCreationStep.WORKFLOW:
        return selectedWorkflowIds.length > 0;
      case ZapCreationStep.DETAILS:
        return !!zapName.trim();
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Zap</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {[
              "Choose Trigger",
              "Choose Workflow",
              "Add Details",
              "Confirm",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === ZapCreationStep.TRIGGER}
            >
              Back
            </Button>
            
            {currentStep === ZapCreationStep.CONFIRMATION ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Zap"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 