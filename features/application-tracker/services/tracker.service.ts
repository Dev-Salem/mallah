import { createClient } from "@/lib/supabase/server";
import { CreateApplicationDTO, JobApplication, UpdateApplicationDTO } from "../types";

export const trackerService = {
  async getApplications(): Promise<JobApplication[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("application_tracker")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) throw error;
    return data as JobApplication[];
  },

  async createApplication(dto: CreateApplicationDTO): Promise<JobApplication> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("application_tracker")
      .insert({
        ...dto,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data as JobApplication;
  },

  async updateApplication(dto: UpdateApplicationDTO): Promise<JobApplication> {
    const supabase = await createClient();
    const { application_id, ...updates } = dto;

    const { data, error } = await supabase
      .from("application_tracker")
      .update(updates)
      .eq("application_id", application_id)
      .select()
      .single();

    if (error) throw error;
    return data as JobApplication;
  },

  async deleteApplication(applicationId: string): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("application_tracker")
      .delete()
      .eq("application_id", applicationId);

    if (error) throw error;
  },

  async getTrackedAnalysesIds(): Promise<string[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("application_tracker")
      .select("analysis_id")
      .eq("user_id", user.id)
      .not("analysis_id", "is", null);

    if (error) throw error;
    return data.map(d => d.analysis_id) as string[];
  }
};
