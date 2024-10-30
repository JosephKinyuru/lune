"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import { useState, useTransition } from "react";
import { signinSchema, SigninValues } from "@/lib/validation";
import LoadingButton from "@/components/LoadingButton";
import { redirect } from "next/navigation";

export default function SignInForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninValues) {
    setError(undefined);
    startTransition(async () => {
      const result = await signIn(values);
      if (result.success) {
        redirect("/"); 
      } else {
        console.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  type="email"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary/70 underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <LoadingButton loading={isPending} className="w-full" type="submit">
          Sign In
        </LoadingButton>
      </form>
    </Form>
  );
}
