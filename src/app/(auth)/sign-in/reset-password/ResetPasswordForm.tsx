"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import { resetPassword } from "./actions";
import LoadingButton from "@/components/LoadingButton";

export default function ResetPasswordForm({ email }: { email: string }) {
  const [message, setMessage] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", passwordConfirmation: "", email },
  });

  async function handleResetPassword(values: ResetPasswordValues) {
    const { success, message } = await resetPassword(values);
    if (message) {
      setMessage(message);
      setIsSuccess(false);
    } else if (success) {
      setMessage(success);
      setIsSuccess(true);
    }
  }

  function onSubmit(values: ResetPasswordValues) {
    setMessage(undefined);
    setIsSuccess(false);

    startTransition(() => {
      handleResetPassword(values); // Call the async function without awaiting it
    });
  }

  return (
    <>
      {isSuccess && (
        <>
          <Alert variant="success">
            <Terminal className="h-4 w-4 text-green-500/70" />
            <AlertTitle className="text-green-500">Password updated</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          <Button variant="default" asChild className="w-full">
            <Link href="/sign-in">Login with New Password</Link>
          </Button>
        </>
      )}

      {!isSuccess && (
        <>
          {message && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full shadow-lg dark:shadow-none xl:h-11"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full shadow-lg dark:shadow-none xl:h-11"
                        type="password"
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
                Change Password
              </LoadingButton>
            </form>
          </Form>
        </>
      )}
    </>
  );
}
