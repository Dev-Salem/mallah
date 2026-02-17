"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { AuthFormState } from "../types";

function getOrigin(): string {
    // Fallback for server context
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function register(
    _prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!firstName || !lastName || !email || !password) {
        return { error: "All fields are required.", success: null };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters.", success: null };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match.", success: null };
    }

    const supabase = await createClient();
    const origin = getOrigin();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message, success: null };
    }

    return {
        error: null,
        success: "CHECK_EMAIL",
    };
}

export async function login(
    _prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required.", success: null };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Invalid email or password.", success: null };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function forgotPassword(
    _prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
        return { error: "Email is required.", success: null };
    }

    const supabase = await createClient();
    const origin = getOrigin();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
        return { error: error.message, success: null };
    }

    return { error: null, success: "RESET_LINK_SENT" };
}

export async function resetPassword(
    _prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password) {
        return { error: "Password is required.", success: null };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters.", success: null };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match.", success: null };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { error: error.message, success: null };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
