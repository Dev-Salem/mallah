"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, LoginFormValues } from "../schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: LoginFormValues, locale: string) {
    const supabase = await createClient();

    // 1. Validate data
    const validatedFields = loginSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            error: "Invalid email or password format.",
        };
    }

    const { email, password } = validatedFields.data;

    // 2. Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Invalid credentials. Access denied." };
    }

    // 3. Determine redirect path based on role and onboarding status
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, learners(onboarding_completed)")
        .eq("user_id", data.user.id)
        .single();

    if (profileError || !profile) {
        // Fallback if profile not found
        redirect(`/${locale}/dashboard`);
    }

    revalidatePath("/", "layout");

    if (profile.role === "admin") {
        redirect(`/${locale}/admin/dashboard`);
    }

    const learnersData = Array.isArray(profile.learners) ? profile.learners[0] : profile.learners;
    const onboardingCompleted = learnersData?.onboarding_completed ?? false;

    if (!onboardingCompleted) {
        redirect(`/${locale}/onboarding`);
    }

    redirect(`/${locale}/dashboard`);
}
