import { z } from "zod";

const signinSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().nonempty("Password is required"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[@#$%^&*!]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.email("Please provide a valid email").optional(),
  profileImage: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: z.string()
    .min(6, "New password must be at least 6 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "New password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "New password must contain at least one number",
    })
    .refine((val) => /[@#$%^&*!]/.test(val), {
      message: "New password must contain at least one special character",
    }),
});

export {
  signinSchema,
  signupSchema,
  updateProfileSchema,
  changePasswordSchema,
};
