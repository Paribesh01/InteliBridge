import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useTriggers, useUpdateZapTrigger } from "@/hooks/useTriggers";

interface StepAppSelectProps {
  type: "trigger" | "workflow";
  onComplete: () => void;
  selectedId: string | null;
  zapId: string;
}

const AppSelectSchema = z.object({
  selectedAppId: z.string().min(1, "Please select an app"),
});

type AppSelectFormData = z.infer<typeof AppSelectSchema>;

const StepAppSelect: React.FC<StepAppSelectProps> = ({
  type,
  selectedId,
  zapId,
  onComplete,
}) => {
  const { data, isLoading, error } = useTriggers();
  const updateZapTrigger = useUpdateZapTrigger();

  const apps = data?.triggers || [];

  const form = useForm<AppSelectFormData>({
    resolver: zodResolver(AppSelectSchema),
    defaultValues: {
      selectedAppId: selectedId || "",
    },
    mode: "onChange",
  });

  const handleAppSelect = (app: any) => {
    form.setValue("selectedAppId", app.id, { shouldValidate: true });
    updateZapTrigger.mutate({ id: zapId, triggerId: app.id });
  };

  const onSubmit = async (data: AppSelectFormData) => {
    try {
      await updateZapTrigger.mutateAsync({
        id: zapId,
        triggerId: data.selectedAppId,
      });
      onComplete();
      toast.success("App selected successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to select app.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Select an App</h2>
            <p className="text-sm text-gray-500">
              Choose an app to {type === "trigger" ? "trigger" : "perform"} your
              automation
            </p>
          </div>

          {isLoading ? (
            <div>Loading apps...</div>
          ) : error ? (
            <div className="text-red-500">Failed to load apps</div>
          ) : (
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Apps</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-md cursor-pointer border transition-all hover:shadow-sm",
                        form.watch("selectedAppId") === app.id
                          ? "border-primary"
                          : "border-gray-200"
                      )}
                      onClick={() => handleAppSelect(app)}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-md flex items-center justify-center text-white font-bold mb-2"
                        )}
                      >
                        {app.image ? (
                          <img
                            src={app.image}
                            alt={app.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          app.name[0]
                        )}
                      </div>
                      <span className="text-sm">{app.name}</span>
                    </div>
                  ))}
                </div>

                {form.formState.errors.selectedAppId && (
                  <div className="text-red-500 mt-2">
                    {form.formState.errors.selectedAppId.message}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default StepAppSelect;
