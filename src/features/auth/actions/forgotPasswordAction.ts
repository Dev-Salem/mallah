"use server";

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "../schemas";

export async function forgotPasswordAction(formData: ForgotPasswordFormValues) {
    // 1. Validate data
    const validatedFields = forgotPasswordSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid email format." };
    }

    const { email } = validatedFields.data;
    const supabase = await createClient();

    // 2. Send reset email via Supabase Auth
    // Always return neutral success to prevent email enumeration
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/en/reset-password`,
    });

    if (error) {
        // Log error server-side but return neutral message to user
        console.error("Password reset error:", error.message);
    }

    // Always return success (neutral response per spec)
    return { success: true };
}
