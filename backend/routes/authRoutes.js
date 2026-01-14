import express from 'express';
import { z } from "zod";

import {
    signup,
    signin,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js'

import {protect, validate } from '../middleware/authMiddleware.js'

const router = express.Router()


// Validation schema
const emailSchema = z.email("Please provide a valid email");
const usernameSchema = z.string().min(3, "Username must be at least 3 characters");

const passwordSchema = z.string().min(6, "Password must be at least 6 characters long")
  .max(12, "Password must not exceed 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@#$%^&*!]/, "Password must contain at least one special character");

const signinSchema = z.object({
  email: emailSchema,
  password: z.string().nonempty("Password is required"),
});

const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: passwordSchema,
});

router.post('/signin', validate(signinSchema), signin);
router.post('/signup', validate(signupSchema), signup);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
