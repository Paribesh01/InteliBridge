import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetSubZap } from "@/hooks/useSubZap";

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

const StepActionSelect: React.FC<StepActionSelectProps> = ({
  type,
  onComplete,
  selectedAppId,
}) => {
  const form = useForm<ActionSelectFormData>({
    resolver: zodResolver(ActionSelectSchema),
    defaultValues: {
      selectedActionId: "",
    },
    mode: "onChange",
  });

  const { getSub, data: actions, isPending, error } = useGetSubZap();

  useEffect(() => {
    if (selectedAppId) {
      getSub(selectedAppId);
    }
  }, [selectedAppId, getSub]);

  useEffect(() => {
    console.log("actions", actions);
  }, [actions]);

  const subActions: any = actions?.subTypes ?? [];

  const handleActionSelect = (action: any) => {
    form.setValue("selectedActionId", action, { shouldValidate: true });
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
            {isPending && <div>Loading actions...</div>}
            {error && (
              <div className="text-red-500">Failed to load actions.</div>
            )}
            {subActions.map((action: any) => (
              <div
                key={action.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-all hover:border-primary",
                  form.watch("selectedActionId") === action
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                )}
                onClick={() => handleActionSelect(action)}
              >
                <h3 className="font-medium">{action}</h3>
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
