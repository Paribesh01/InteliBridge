"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormError,
} from "@/components/ui/form";
import { createUser } from "@/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createUser(data);
      console.log("User created:", res);
      toast.success("User created successfully");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sign up for an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div>
                        <Input
                          {...field}
                          placeholder="Full Name"
                          className="bg-white"
                        />
                        {error?.message && (
                          <FormError className="text-left">
                            {error.message}
                          </FormError>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="bg-white"
                        />
                        {error?.message && (
                          <FormError className="text-left">
                            {error.message}
                          </FormError>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div>
                        <Input
                          {...field}
                          id="password"
                          placeholder="*******"
                          required
                          className="focus:border-brand-dark focus:ring-brand-dark block w-full rounded-md shadow-sm sm:text-sm"
                        />
                        {error?.message && (
                          <FormError className="text-left">
                            {error.message}
                          </FormError>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-10 w-full justify-center"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Signup
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
