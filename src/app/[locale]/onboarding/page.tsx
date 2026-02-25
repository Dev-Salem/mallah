import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOnboardingState } from "@/features/onboarding/services/onboarding-service";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";

export default async function OnboardingPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth`);
    }

    // Check if onboarding is already completed
    const { data: learner } = await supabase
        .from('learners')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single();

    if (learner?.onboarding_completed) {
        redirect(`/${locale}/dashboard`);
    }

    const initialState = await getOnboardingState(user.id);

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col pt-10">
            <OnboardingWizard userId={user.id} initialState={initialState || undefined} />
        </main>
    );
}
