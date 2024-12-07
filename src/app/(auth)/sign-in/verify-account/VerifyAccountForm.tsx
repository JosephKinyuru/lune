"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { verifyAccount } from "./actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LoadingButton from "@/components/LoadingButton";

export default function VerifyAccountForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [message, setMessage] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm();
  const [otp, setOtp] = useState("");

  const { toast } = useToast();

  const handleChangeOTP = (value: string) => {
    setOtp(value);
  };

  async function handleVerifyAccount() {
    const { success, error } = await verifyAccount({ otp, token, email });

    if (error) {
      setMessage(error);
      setIsSuccess(false);
    } else if (success) {
      const successMessage = typeof success === "string" ? success : "Success";
      setMessage(successMessage);
      setIsSuccess(true);
      toast({
        title: "OTP Verified",
        description: "Create your account!!",
      });
      setTimeout(() => {
        window.location.href = "/sign-in/reset-password";
      }, 1000);
    }
  }

  function onSubmit() {
    setMessage(undefined);
    setIsSuccess(false);

    startTransition(() => {
      handleVerifyAccount(); 
    });
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
      <div className="flex items-center justify-center">
        <InputOTP maxLength={6} onChange={handleChangeOTP} className="w-full">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex items-center justify-center">
        <LoadingButton loading={isPending} className="w-[48%]" type="submit">
          Next
        </LoadingButton>
      </div>

      {message && !isSuccess && (
        <Alert variant={isSuccess ? "success" : "destructive"}>
          <AlertTitle>{isSuccess ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
