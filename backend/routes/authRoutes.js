import express from 'express';
import { z } from "zod";

import {
    signin,
    signup,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js'

import { protect, validate } from '../middleware/auth.js'

const router = express.Router


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

app.post('/signin', validate(signinSchema), signin);
app.post('/signup', validate(signupSchema), signup);

// Protected routes
app.get('/profile', protect, getProfile);
app.put('/profile', protect, updateProfile);
app.post('/change-password', protect, changePassword);

export default router;
