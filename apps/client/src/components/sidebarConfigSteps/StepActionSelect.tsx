import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StepActionSelectProps {
  type: "trigger" | "workflow";
  onComplete: () => void;
  selectedAppId: string;
  zapId: string;
}

interface ActionOption {
  id: string;
  name: string;
  description: string;
}

const ActionSelectSchema = z.object({
  selectedActionId: z.string().min(1, "Please select an action"),
});

type ActionSelectFormData = z.infer<typeof ActionSelectSchema>;

// This would typically come from your API/backend
const mockActions: ActionOption[] = [
  {
    id: "new-message",
    name: "New Message",
    description: "Triggers when a new message is posted in a channel",
  },
  {
    id: "user-joins",
    name: "User Joins",
    description: "Triggers when a new user joins the server",
  },
  {
    id: "reaction-added",
    name: "Reaction Added",
    description: "Triggers when a reaction is added to a message",
  },
];

const StepActionSelect: React.FC<StepActionSelectProps> = ({
  type,
  onComplete,
  selectedAppId,
  zapId,
}) => {
  const form = useForm<ActionSelectFormData>({
    resolver: zodResolver(ActionSelectSchema),
    defaultValues: {
      selectedActionId: "",
    },
    mode: "onChange",
  });

  const handleActionSelect = (action: ActionOption) => {
    form.setValue("selectedActionId", action.id, { shouldValidate: true });
  };

  const onSubmit = async (data: ActionSelectFormData) => {
    try {
      // Here you would typically make an API call to save the selected action
      // await updateZapAction.mutateAsync({
      //   id: zapId,
      //   actionId: data.selectedActionId,
      // });
      onComplete();
      toast.success("Action selected successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to select action.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              Select a {type === "trigger" ? "Trigger" : "Action"}
            </h2>
            <p className="text-sm text-gray-500">
              Choose how this app will{" "}
              {type === "trigger" ? "trigger" : "perform"} your automation
            </p>
          </div>

          <div className="space-y-2">
            {mockActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-all hover:border-primary",
                  form.watch("selectedActionId") === action.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                )}
                onClick={() => handleActionSelect(action)}
              >
                <h3 className="font-medium">{action.name}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            ))}
          </div>

          {form.formState.errors.selectedActionId && (
            <div className="text-red-500 mt-2">
              {form.formState.errors.selectedActionId.message}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              disabled={!form.formState.isValid}
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default StepActionSelect;
