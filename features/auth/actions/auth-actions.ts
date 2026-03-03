'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    type LoginFormData,
    type RegisterFormData,
    type ForgotPasswordFormData,
    type ResetPasswordFormData,
    type AuthActionResult,
} from '../types'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function registerAction(
    formData: RegisterFormData
): Promise<AuthActionResult> {
    const parsed = registerSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: 'errors.generic' }
    }

    const { firstName, lastName, email, password } = parsed.data
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
            return { success: false, error: 'errors.emailTaken' }
        }
        return { success: false, error: 'errors.generic' }
    }

    return { success: true }
}

export async function loginAction(
    formData: LoginFormData
): Promise<AuthActionResult> {
    const parsed = loginSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: 'errors.generic' }
    }

    const { email, password } = parsed.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, error: 'errors.invalidCredentials' }
    }

    const { user } = data

    // Check email verification status
    if (!user?.email_confirmed_at) {
        return { success: false, error: 'errors.emailNotVerified' }
    }

    // Determine redirect based on role and onboarding status
    const userId = user.id

    const { data: learner } = await supabase
        .from('learners')
        .select('role, onboarding_completed, status')
        .eq('user_id', userId)
        .single()

    // Check account status
    if (learner?.status === 'blocked') {
        return { success: false, error: 'errors.accountBlocked' }
    }

    if (learner?.status === 'deleted') {
        return { success: false, error: 'errors.accountNotFound' }
    }

    if (learner?.role === 'admin') {
        return { success: true, redirectTo: '/admin' }
    }

    if (learner && !learner.onboarding_completed) {
        return { success: true, redirectTo: '/onboarding' }
    }

    return { success: true, redirectTo: '/dashboard' }
}

export async function forgotPasswordAction(
    formData: ForgotPasswordFormData
): Promise<AuthActionResult> {
    const parsed = forgotPasswordSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: 'errors.generic' }
    }

    const { email } = parsed.data
    const supabase = await createClient()

    // Check if user exists and is confirmed via admin client
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const user = users.find((u: { email?: string }) => u.email === email)

    if (user) {
        if (!user.email_confirmed_at) {
            // If not confirmed, resend verification email instead
            await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                }
            })
        } else {
            // If confirmed, send reset link
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback?next=/reset-password`,
            })
        }
    }

    // Always return success to avoid revealing whether email exists
    return { success: true }
}

export async function resetPasswordAction(
    formData: ResetPasswordFormData
): Promise<AuthActionResult> {
    const parsed = resetPasswordSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: 'errors.generic' }
    }

    const { password } = parsed.data
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return { success: false, error: 'errors.generic' }
    }

    return { success: true }
}

export async function signOutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
