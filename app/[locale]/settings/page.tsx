import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getProfileAction } from "@/features/settings";
import { SettingsPage } from "@/features/settings/components/SettingsPage";

export default async function SettingsRoute() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    // Check onboarding
    const { data: learner } = await supabase
        .from("learners")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single();

    if (!learner || !learner.onboarding_completed) {
        redirect(`/${locale}/onboarding`);
    }

    const result = await getProfileAction();

    if (!result.success || !result.data) {
        redirect(`/${locale}/dashboard`);
    }

    return <SettingsPage profile={result.data} />;
}
