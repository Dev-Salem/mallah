import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingWizard from "@/features/onboarding/components/OnboardingWizard";
import { getOnboardingDraftAction } from "@/features/onboarding/actions/onboarding-actions";

export default async function OnboardingPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if onboarding is already completed
    const { data: learner } = await supabase
        .from("learners")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single();

    if (learner?.onboarding_completed) {
        redirect("/dashboard");
    }

    // Fetch existing draft if any
    const draftResult = await getOnboardingDraftAction();
    const initialDraft = draftResult.success ? draftResult.draft : null;

    return <OnboardingWizard initialDraft={initialDraft} />;
}
