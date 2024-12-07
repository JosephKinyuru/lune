"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { signUpFormSchema, SignUpFormValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "./actions";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthMap: { [key: string]: number } = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

function getDaysInMonth(monthIndex: number, year: number): number[] {
  // Create a Date object for the first day of the month
  const date = new Date(year, monthIndex, 1);

  // Get the number of days in the month
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i,
);

export default function SignUpForm({ email }: { email: string }) {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: email,
      full_name: "",
      password: "",
      month: "",
      day: "",
      year: "",
    },
  });

  async function handleSignUp(values: SignUpFormValues) {
    const { month, day, year, ...rest } = values;
    const monthNumber = monthMap[month];
    const date_of_birth = new Date(Number(year), monthNumber, Number(day));

    if (isNaN(date_of_birth.getTime())) {
      setError("Invalid date of birth");
      return;
    }

    const { error } = await signUp({ ...rest, date_of_birth });
    if (error) setError(error);
  }

  function onSubmit(values: SignUpFormValues) {
    setError(undefined);

    startTransition(() => {
      handleSignUp(values); 
    });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="h-10 shadow-lg dark:shadow-none xl:h-11"
                  {...field}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  className="h-10 shadow-lg dark:shadow-none xl:h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-5">
          <FormLabel>Date of Birth</FormLabel>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="block h-10 w-2/4 space-y-1 rounded-sm bg-background shadow-lg dark:shadow-none">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem className="block h-10 w-1/4 space-y-1 rounded-sm bg-background shadow-lg dark:shadow-none">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {form.watch("month") &&
                            getDaysInMonth(
                              monthMap[form.watch("month")],
                              new Date().getFullYear(),
                            ).map((day, index) => (
                              <SelectItem key={index} value={day.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          {!form.watch("month") && (
                            <SelectItem key={0} value="none" disabled>
                              Select Month
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="block h-10 w-1/4 space-y-1 rounded-sm bg-background shadow-lg dark:shadow-none">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full w-full">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {years.map((year, index) => (
                            <SelectItem key={index} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}