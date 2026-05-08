'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from '@/lib/i18n/routing'
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

export async function registerAction(
    formData: RegisterFormData
): Promise<AuthActionResult> {
    const parsed = registerSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: 'errors.generic' }
    }

    const { firstName, lastName, email, password } = parsed.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
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
            return { success: true, redirectTo: '/login' }
        }
        return { success: false, error: 'errors.generic' }
    }

    // Supabase returns an empty identities array for repeated signups of already-confirmed users
    // In that case, redirect to login instead of check-email
    if (data?.user?.identities?.length === 0) {
        return { success: true, redirectTo: '/login' }
    }

    return { success: true, redirectTo: '/register/check-email' }
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
        // Map specific Supabase confirm email errors to our i18n key
        if (error.message.toLowerCase().includes('email not confirmed')) {
            return { success: false, error: 'errors.emailNotVerified' }
        }
        return { success: false, error: 'errors.invalidCredentials' }
    }

    const { user } = data
    console.log(`[LoginAction] Success for user: ${user.id}`);

    // Check email verification status
    if (!user?.email_confirmed_at) {
        return { success: false, error: 'errors.emailNotVerified' }
    }

    // Determine redirect based on role and onboarding status
    const userId = user.id

    const { data: learner, error: learnerError } = await supabase
        .from('learners')
        .select('role, onboarding_completed, status')
        .eq('user_id', userId)
        .single()

    if (learnerError) {
        console.warn(`[LoginAction] Learner record not found or error: ${learnerError.message}`);
    } else {
        console.log(`[LoginAction] Learner state: role=${learner.role}, onboarding=${learner.onboarding_completed}, status=${learner.status}`);
    }

    // Check account status
    if (learner?.status === 'blocked') {
        return { success: false, error: 'errors.accountBlocked' }
    }

    if (learner?.status === 'deleted') {
        return { success: false, error: 'errors.accountNotFound' }
    }

    const redirectTo = learner?.role === 'admin' 
        ? '/admin' 
        : (learner && !learner.onboarding_completed ? '/onboarding' : '/dashboard');

    console.log(`[LoginAction] Success. Returning redirectTo: ${redirectTo}`);
    return { success: true, redirectTo };
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

    // Just send the reset link — Supabase will silently do nothing if the email doesn't exist,
    // which aligns with the spec: never reveal whether an account exists.
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback?next=/reset-password`,
    })

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
    redirect({ href: '/', locale: 'en' })
}

export async function resendVerificationEmailAction(
    email: string
): Promise<AuthActionResult> {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`,
        }
    })

    if (error) {
        return { success: false, error: 'errors.generic' }
    }

    return { success: true }
}
