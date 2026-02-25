"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";

export async function resetOnboardingAction(): Promise<void> {
    const supabase = await createClient();
    const locale = await getLocale();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Delete AI recommendations for this user
    await supabase
        .from("ai_recommendations")
        .delete()
        .eq("user_id", user.id);

    // 2. Delete the onboarding response row
    await supabase
        .from("onboarding_responses")
        .delete()
        .eq("user_id", user.id);

    // 3. Reset the learner's onboarding status
    await supabase
        .from("learners")
        .update({ onboarding_completed: false, current_path_id: null })
        .eq("user_id", user.id);

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    redirect(`/${locale}/onboarding`);
}
