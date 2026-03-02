import { z } from 'zod'

// --- Zod Schemas ---

export const loginSchema = z.object({
    email: z.string().email('validation.invalidEmail'),
    password: z.string().min(1, 'validation.required'),
})

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(1, 'validation.required')
            .max(100),
        lastName: z
            .string()
            .min(1, 'validation.required')
            .max(100),
        email: z.string().email('validation.invalidEmail'),
        password: z
            .string()
            .min(8, 'validation.minLength')
            .regex(/[a-zA-Z]/, 'validation.passwordRequirements')
            .regex(/[0-9]/, 'validation.passwordRequirements'),
        confirmPassword: z.string().min(1, 'validation.required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'errors.passwordMismatch',
        path: ['confirmPassword'],
    })

export const forgotPasswordSchema = z.object({
    email: z.string().email('validation.invalidEmail'),
})

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'validation.minLength')
            .regex(/[a-zA-Z]/, 'validation.passwordRequirements')
            .regex(/[0-9]/, 'validation.passwordRequirements'),
        confirmPassword: z.string().min(1, 'validation.required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'errors.passwordMismatch',
        path: ['confirmPassword'],
    })

// --- TypeScript Types ---

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export type AuthActionResult = {
    success: boolean
    error?: string
    redirectTo?: string
}
