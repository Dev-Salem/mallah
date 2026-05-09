import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { VELOCITY_MAP } from "@/features/onboarding/constants";
import type { OnboardingDraft } from "@/features/onboarding/types";

export async function PATCH(request: NextRequest) {
    try {
        const draft: OnboardingDraft = await request.json();

        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        }

        const { data: existing } = await supabase
            .from("onboarding_responses")
            .select("onboarding_id")
            .eq("user_id", user.id)
            .is("completed_at", null)
            .order("created_at", { ascending: false })
            .maybeSingle();

        const payload = {
            user_id: user.id,
            background_type: draft.backgroundType,
            primary_goal: draft.primaryGoal,
            weekly_hours_category: draft.weeklyHoursCategory,
            learning_velocity: draft.weeklyHoursCategory
                ? VELOCITY_MAP[draft.weeklyHoursCategory]
                : undefined,
            raw_interests: draft.interests,
            confidence_snapshot: draft.confidenceItems,
            readiness_level: draft.confidenceItems
                ? draft.confidenceItems.reduce((acc, item) => {
                    if (item.level === "comfortable") return acc + 2;
                    if (item.level === "tried") return acc + 1;
                    return acc;
                  }, 0)
                : undefined,
            ai_language_pref: draft.aiLanguagePref,
            ai_detail_level: draft.aiDetailLevel,
            current_step: draft.currentStep,
        };

        if (existing) {
            const { error } = await supabase
                .from("onboarding_responses")
                .update(payload)
                .eq("onboarding_id", existing.onboarding_id);

            if (error) throw error;
            return NextResponse.json({ onboardingId: existing.onboarding_id });
        } else {
            const { data: insertRow, error } = await supabase
                .from("onboarding_responses")
                .insert(payload)
                .select("onboarding_id")
                .single();

            if (error || !insertRow) throw error;
            return NextResponse.json({ onboardingId: insertRow.onboarding_id });
        }
    } catch (error: unknown) {
        console.error("Draft save error:", error);
        return NextResponse.json({ error: "Failed to save draft." }, { status: 500 });
    }
}
