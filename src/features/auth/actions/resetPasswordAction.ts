"use server";

import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schemas";

export async function resetPasswordAction(formData: ResetPasswordFormValues) {
    // 1. Validate data
    const validatedFields = resetPasswordSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid password format." };
    }

    const { password } = validatedFields.data;
    const supabase = await createClient();

    // 2. Update password via Supabase Auth
    // User must have a valid session from the reset link callback
    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
