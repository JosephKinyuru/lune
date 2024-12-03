import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpFormSchema = z.object({
  email: requiredString.email("Invalid email address"),
  full_name: requiredString
    .min(5, "Must be at least 5 characters")
    .regex(
      /^[a-zA-Z0-9 _-\s]+$/,
      "Only letters, numbers, spaces, - and _ allowed",
    ),
  password: requiredString.min(8, "Password must be at least 8 characters"),
  month: requiredString.refine((month) => month !== "", {
    message: "Month is required",
  }),
  day: requiredString.refine((day) => day !== "", {
    message: "Day is required",
  }),
  year: requiredString.refine((year) => year !== "", {
    message: "Year is required",
  }),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  full_name: requiredString.min(5, "Name must be at least 5 characters"),
  password: requiredString.min(8, "Password must be at least 8 characters"),
  date_of_birth: z.date(),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const confirmEmailSchema = z.object({
  email: requiredString.email("Invalid email address"),
});

export type ConfirmEmailValues = z.infer<typeof confirmEmailSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SigninValues = z.infer<typeof signinSchema>;

export const forgotSchema = z.object({
  email: z.string().email(),
});

export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string(),
    passwordConfirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const usernameSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
});

export type UsernameValues = z.infer<typeof usernameSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
