"use server";

import { createClient } from "@/lib/supabase/server";
import type { OpportunityAnalysis } from "../types";

export async function getUserAnalyses(userId: string): Promise<OpportunityAnalysis[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("opportunity_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getAnalysisDetail(analysisId: string): Promise<OpportunityAnalysis | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("opportunity_analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

    if (error) return null;
    return data;
}
