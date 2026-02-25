"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema, RegisterFormValues } from "../schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function registerAction(formData: RegisterFormValues, locale: string) {
    const supabase = await createClient();

    // 1. Validate data
    const validatedFields = registerSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields. Please check your input.",
        };
    }

    const { email, password, firstName, lastName } = validatedFields.data;

    // 2. Register user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.user) {
        // 3. Profiles are handled via DB triggers typically, 
        // but we can ensure learner record exists if needed.
        // In our case, RLS and triggers should handle the insertion into `public.users` and `public.learners`.

        revalidatePath("/", "layout");
        redirect(`/${locale}/onboarding`);
    }

    return { success: true };
}
