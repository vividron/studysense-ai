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
const signinSchema = z.object({
    email: z.email("Please provide a valid email"),
    password: z.string().nonempty("Password is required"),
});

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Please provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long")
        .refine((val) => /[A-Z]/.test(val), { // regular expression to check and refine password
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
    profileImage: z.string().optional()
});

const changePasswordSchema = z.object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long")
        .refine((val) => /[A-Z]/.test(val), { // regular expression to check and refine password
            message: "New password must contain at least one uppercase letter",
        })
        .refine((val) => /\d/.test(val), {
            message: "New password must contain at least one number",
        })
        .refine((val) => /[@#$%^&*!]/.test(val), {
            message: "New password must contain at least one special character",
        }),
});

router.post('/signin', validate(signinSchema), signin);
router.post('/signup', validate(signupSchema), signup);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
