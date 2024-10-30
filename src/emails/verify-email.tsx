import * as React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function VerifyEmail({ otp }: { otp: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] max-w-full rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px] text-center">
                <Img
                  src={`${BASE_URL}/group.jpeg`}
                  width="160"
                  height="48"
                  alt="StarterKit"
                  className="mx-auto my-0"
                />
              </Section>

              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[18px] font-bold leading-[24px] text-black">
                  Your OTP Code
                </Text>
                <Text className="mb-4 text-[32px] font-bold leading-[40px] text-black">
                  {otp}
                </Text>
                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  Please use this OTP to verify your email. It will expire in 5
                  minutes.
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © 2024 Lune. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}
