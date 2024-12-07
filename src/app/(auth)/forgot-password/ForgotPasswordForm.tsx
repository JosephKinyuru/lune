"use client";

import { useState, useTransition } from "react";
import { forgotPassword } from "./actions";
import { useForm } from "react-hook-form";
import { forgotSchema, ForgotValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(values: ForgotValues) {
    const { error } = await forgotPassword(values);
    if (error) setError(error);
  }

  function onSubmit(values: ForgotValues) {
    setError(undefined);
    startTransition(() => {
      handleForgotPassword(values);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-center text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full shadow-lg dark:shadow-none xl:h-11"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={isPending}
          className="w-full xl:h-9"
          type="submit"
        >
          Send Reset Email
        </LoadingButton>
      </form>
    </Form>
  );
}
