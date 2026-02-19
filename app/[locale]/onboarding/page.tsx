import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { OnboardingWizard } from "@/features/onboarding";
import { getProfile, getActivePaths } from "@/features/onboarding/services/onboarding-service";
import { Logo } from "@/components/ui/logo";

export default async function OnboardingPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    const profile = await getProfile(user.id);

    if (!profile) {
        redirect(`/${locale}/login`);
    }

    if (profile.onboarding_completed) {
        redirect(`/${locale}/dashboard`);
    }

    const paths = await getActivePaths();

    return (
        <div>
            <div className="text-center mb-12">
                <div className="inline-block p-1 border border-primary/20 glass mb-6">
                    <Logo size={48} />
                </div>
            </div>

            <OnboardingWizard
                profile={profile}
                paths={paths}
                initialStep={1}
            />
        </div>
    );
}
