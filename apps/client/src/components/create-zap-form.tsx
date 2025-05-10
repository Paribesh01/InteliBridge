"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateZap } from "@/hooks/useCreateZap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormError,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CreateZapSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CreateZapFormData = z.infer<typeof CreateZapSchema>;

export function CreateZapForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: createZap, isPending, isError, error } = useCreateZap();

  const form = useForm<CreateZapFormData>({
    resolver: zodResolver(CreateZapSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: CreateZapFormData) => {
    createZap(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Zap</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-medium">Name Your Zap</h2>
              <p className="text-sm text-muted-foreground">
                Give your automation a name
              </p>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <label htmlFor="zap-name">Name (required)</label>
                      <FormControl>
                        <Input
                          {...field}
                          id="zap-name"
                          placeholder="e.g., Email Notifications"
                        />
                      </FormControl>
                      {error?.message && <FormError>{error.message}</FormError>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <label htmlFor="zap-description">
                        Description (optional)
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          id="zap-description"
                          placeholder="Describe what this Zap does"
                        />
                      </FormControl>
                      {error?.message && <FormError>{error.message}</FormError>}
                    </FormItem>
                  )}
                />
              </div>
              {isError && (
                <div className="rounded-md p-3 bg-destructive/10 text-destructive mt-4">
                  <p className="text-sm font-medium">Error: {error?.message}</p>
                </div>
              )}
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
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
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
