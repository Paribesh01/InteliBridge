"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTriggers } from "@/hooks/useTriggers";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useCreateZap } from "@/hooks/useCreateZap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AvailableTrigger, AvailableWorkflow } from "@/types";
import { Loader2, ArrowRight, ChevronRight, Check } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/authOptions";

enum ZapCreationStep {
  AVAILABLE_TRIGGER = 0,
  TRIGGER = 1,
  AVAILABLE_WORKFLOW = 2,
  WORKFLOW = 3,
  DETAILS = 4,
  CONFIRMATION = 5,
}

export function CreateZapForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<ZapCreationStep>(
    ZapCreationStep.AVAILABLE_TRIGGER
  );
  const [selectedAvailableTriggerId, setSelectedAvailableTriggerId] =
    useState<string>("");
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>("");
  const [selectedAvailableWorkflowId, setSelectedAvailableWorkflowId] =
    useState<string>("");
  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);
  const [zapName, setZapName] = useState<string>("");
  const [zapDescription, setZapDescription] = useState<string>("");

  const { data: triggersData, isLoading: isLoadingTriggers } = useTriggers();
  const { data: workflowsData, isLoading: isLoadingWorkflows } = useWorkflows();
  const { mutate: createZap, isPending, isError, error } = useCreateZap();

  const handleSelectAvailableTrigger = (availableTriggerId: string) => {
    setSelectedAvailableTriggerId(availableTriggerId);
  };

  const handleSelectTrigger = (triggerId: string) => {
    setSelectedTriggerId(triggerId);
  };

  const handleSelectAvailableWorkflow = (availableWorkflowId: string) => {
    setSelectedAvailableWorkflowId(availableWorkflowId);
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
    if (currentStep > ZapCreationStep.AVAILABLE_TRIGGER) {
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
      case ZapCreationStep.AVAILABLE_TRIGGER:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose a Trigger Provider</h2>
            <p className="text-sm text-muted-foreground">
              Select a service that will provide your trigger
            </p>

            {isLoadingTriggers ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RadioGroup
                value={selectedAvailableTriggerId}
                onValueChange={handleSelectAvailableTrigger}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                {triggersData?.triggers.map(
                  (availableTrigger: AvailableTrigger) => (
                    <div key={availableTrigger.id} className="relative">
                      <RadioGroupItem
                        value={availableTrigger.id}
                        id={availableTrigger.id}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={availableTrigger.id}
                        className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                          selectedAvailableTriggerId === availableTrigger.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10">
                          <img
                            src={availableTrigger.image}
                            alt={availableTrigger.name}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{availableTrigger.name}</p>

                          {availableTrigger.subType && (
                            <p className="text-sm text-muted-foreground">
                              {availableTrigger.subType}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            )}
          </div>
        );

      case ZapCreationStep.TRIGGER:
        const selectedAvailableTrigger = triggersData?.triggers.find(
          (t) => t.id === selectedAvailableTriggerId
        );

        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose a Specific Trigger</h2>
            <p className="text-sm text-muted-foreground">
              Select the specific trigger event from{" "}
              {selectedAvailableTrigger?.name}
            </p>

            {!selectedAvailableTrigger ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RadioGroup
                value={selectedTriggerId}
                onValueChange={handleSelectTrigger}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                {selectedAvailableTrigger.triggers.map((trigger) => (
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
                          src={selectedAvailableTrigger.image}
                          alt={trigger.id}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {trigger.metaData && (
                            <span className="text-xl text-muted-foreground">
                              {(trigger.metaData)["subType"]}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trigger.id}
                        </p>
                        
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        );

      case ZapCreationStep.AVAILABLE_WORKFLOW:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose a Workflow Provider</h2>
            <p className="text-sm text-muted-foreground">
              Select a service to find workflows from
            </p>

            {isLoadingWorkflows ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RadioGroup
                value={selectedAvailableWorkflowId}
                onValueChange={handleSelectAvailableWorkflow}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                {workflowsData?.workflows.map(
                  (availableWorkflow: AvailableWorkflow) => (
                    <div key={availableWorkflow.id} className="relative">
                      <RadioGroupItem
                        value={availableWorkflow.id}
                        id={availableWorkflow.id}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={availableWorkflow.id}
                        className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                          selectedAvailableWorkflowId === availableWorkflow.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10">
                          <img
                            src={availableWorkflow.image}
                            alt={availableWorkflow.name}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {availableWorkflow.name}
                          </p>
                          {availableWorkflow.subType && (
                            <p className="text-sm text-muted-foreground">
                              {availableWorkflow.subType}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            )}
          </div>
        );

      case ZapCreationStep.WORKFLOW:
        const selectedAvailableWorkflow = workflowsData?.workflows.find(
          (w) => w.id === selectedAvailableWorkflowId
        );

        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Choose Specific Workflows</h2>
            <p className="text-sm text-muted-foreground">
              Select one or more workflows from{" "}
              {selectedAvailableWorkflow?.name}
            </p>

            {!selectedAvailableWorkflow ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 mt-4">
                {selectedAvailableWorkflow.workflow.map((workflow) => (
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
                        src={selectedAvailableWorkflow.image}
                        alt={workflow.id}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{workflow.id}</p>
                      {workflow.metaData && (
                        <p className="text-sm text-muted-foreground">
                          {JSON.stringify(workflow.metaData)}
                        </p>
                      )}
                    </div>
                    {selectedWorkflowIds.includes(workflow.id) && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
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
                  onChange={(e: any) => setZapDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case ZapCreationStep.CONFIRMATION:
        const selectedAvailableTriggerForConfirmation =
          triggersData?.triggers.find(
            (t) => t.id === selectedAvailableTriggerId
          );

        const selectedTriggerForConfirmation =
          selectedAvailableTriggerForConfirmation?.triggers.find(
            (t) => t.id === selectedTriggerId
          );

        const selectedAvailableWorkflowForConfirmation =
          workflowsData?.workflows.find(
            (w) => w.id === selectedAvailableWorkflowId
          );

        const selectedWorkflowsForConfirmation =
          selectedAvailableWorkflowForConfirmation?.workflow.filter((w) =>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="font-medium">{zapName}</p>
              </div>

              {zapDescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p>{zapDescription}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trigger Provider
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedAvailableTriggerForConfirmation && (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10">
                        <img
                          src={selectedAvailableTriggerForConfirmation.image}
                          alt={selectedAvailableTriggerForConfirmation.name}
                          className="w-4 h-4"
                        />
                      </div>
                      <p>{selectedAvailableTriggerForConfirmation.name}</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Specific Trigger
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedTriggerForConfirmation && (
                    <p>{selectedTriggerForConfirmation.id}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Workflow Provider
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedAvailableWorkflowForConfirmation && (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10">
                        <img
                          src={selectedAvailableWorkflowForConfirmation.image}
                          alt={selectedAvailableWorkflowForConfirmation.name}
                          className="w-4 h-4"
                        />
                      </div>
                      <p>{selectedAvailableWorkflowForConfirmation.name}</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Selected Workflows
                </p>
                <div className="space-y-2 mt-1">
                  {selectedWorkflowsForConfirmation?.map((workflow1: any) => (
                    <div key={workflow1.id} className="flex items-center gap-2">
                      <p>{workflow1.id}</p>
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
      case ZapCreationStep.AVAILABLE_TRIGGER:
        return !!selectedAvailableTriggerId;
      case ZapCreationStep.TRIGGER:
        return !!selectedTriggerId;
      case ZapCreationStep.AVAILABLE_WORKFLOW:
        return !!selectedAvailableWorkflowId;
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
              "Provider",
              "Trigger",
              "Service",
              "Workflow",
              "Details",
              "Confirm",
            ].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 5 && (
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
              disabled={currentStep === ZapCreationStep.AVAILABLE_TRIGGER}
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
