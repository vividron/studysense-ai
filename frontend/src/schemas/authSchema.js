import { z } from "zod";

const emailSchema = z.email("Please provide a valid email");
const usernameSchema = z.string().min(3, "Username must be at least 3 characters");

const passwordSchema = z.string().min(6, "Password must be at least 6 characters long")
  .max(12, "Password must not exceed 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@#$%^&*!]/, "Password must contain at least one special character");

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().nonempty("Password is required"),
});

export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().nonempty("Please confirm your password")
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"]
});
