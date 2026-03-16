export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          accepted_path_id: string | null
          alternatives: Json | null
          confidence_score: number
          created_at: string
          first_milestone: string | null
          id: string
          onboarding_id: string
          plan_2_weeks: Json | null
          reasons: Json
          recommended_path_id: string
          user_id: string
        }
        Insert: {
          accepted_path_id?: string | null
          alternatives?: Json | null
          confidence_score: number
          created_at?: string
          first_milestone?: string | null
          id?: string
          onboarding_id: string
          plan_2_weeks?: Json | null
          reasons: Json
          recommended_path_id: string
          user_id: string
        }
        Update: {
          accepted_path_id?: string | null
          alternatives?: Json | null
          confidence_score?: number
          created_at?: string
          first_milestone?: string | null
          id?: string
          onboarding_id?: string
          plan_2_weeks?: Json | null
          reasons?: Json
          recommended_path_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "onboarding_responses"
            referencedColumns: ["onboarding_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          session_type: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_type?: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_type?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      cv_uploads: {
        Row: {
          cv_id: string
          experience_years: number | null
          extracted_skills: Json
          file_name: string
          previous_roles: string[] | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          cv_id?: string
          experience_years?: number | null
          extracted_skills?: Json
          file_name: string
          previous_roles?: string[] | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          cv_id?: string
          experience_years?: number | null
          extracted_skills?: Json
          file_name?: string
          previous_roles?: string[] | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learners: {
        Row: {
          ai_detail_level: string | null
          ai_language_pref: string | null
          background_type: string | null
          bio: string | null
          created_at: string
          current_path_id: string | null
          first_name: string
          last_name: string
          learning_velocity: string | null
          onboarding_completed: boolean
          opportunity_analyses_count: number | null
          portfolio_slug: string | null
          primary_goal: string | null
          readiness_level: number | null
          role: string
          status: string | null
          user_id: string
          weekly_hours_category: string | null
        }
        Insert: {
          ai_detail_level?: string | null
          ai_language_pref?: string | null
          background_type?: string | null
          bio?: string | null
          created_at?: string
          current_path_id?: string | null
          first_name: string
          last_name: string
          learning_velocity?: string | null
          onboarding_completed?: boolean
          opportunity_analyses_count?: number | null
          portfolio_slug?: string | null
          primary_goal?: string | null
          readiness_level?: number | null
          role?: string
          status?: string | null
          user_id: string
          weekly_hours_category?: string | null
        }
        Update: {
          ai_detail_level?: string | null
          ai_language_pref?: string | null
          background_type?: string | null
          bio?: string | null
          created_at?: string
          current_path_id?: string | null
          first_name?: string
          last_name?: string
          learning_velocity?: string | null
          onboarding_completed?: boolean
          opportunity_analyses_count?: number | null
          portfolio_slug?: string | null
          primary_goal?: string | null
          readiness_level?: number | null
          role?: string
          status?: string | null
          user_id?: string
          weekly_hours_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learners_current_path_id_fkey"
            columns: ["current_path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["path_id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          ai_detail_level: string | null
          ai_language_pref: string | null
          background_type: string | null
          completed_at: string | null
          confidence_snapshot: Json | null
          created_at: string | null
          current_step: string | null
          interest_vector: Json | null
          learning_velocity: string | null
          onboarding_id: string
          primary_goal: string | null
          raw_interests: string[] | null
          readiness_level: number | null
          user_id: string
          weekly_hours_category: string | null
        }
        Insert: {
          ai_detail_level?: string | null
          ai_language_pref?: string | null
          background_type?: string | null
          completed_at?: string | null
          confidence_snapshot?: Json | null
          created_at?: string | null
          current_step?: string | null
          interest_vector?: Json | null
          learning_velocity?: string | null
          onboarding_id?: string
          primary_goal?: string | null
          raw_interests?: string[] | null
          readiness_level?: number | null
          user_id: string
          weekly_hours_category?: string | null
        }
        Update: {
          ai_detail_level?: string | null
          ai_language_pref?: string | null
          background_type?: string | null
          completed_at?: string | null
          confidence_snapshot?: Json | null
          created_at?: string | null
          current_step?: string | null
          interest_vector?: Json | null
          learning_velocity?: string | null
          onboarding_id?: string
          primary_goal?: string | null
          raw_interests?: string[] | null
          readiness_level?: number | null
          user_id?: string
          weekly_hours_category?: string | null
        }
        Relationships: []
      }
      opportunity_analyses: {
        Row: {
          action_plan: Json
          analysis_id: string
          company_name: string | null
          created_at: string
          cv_skills_contributed: number | null
          extracted_skills: Json
          is_saved: boolean
          job_title: string | null
          last_reanalyzed_at: string
          match_score: number
          raw_jd_text: string
          seniority_level: string | null
          skills_breakdown: Json
          user_id: string
        }
        Insert: {
          action_plan?: Json
          analysis_id?: string
          company_name?: string | null
          created_at?: string
          cv_skills_contributed?: number | null
          extracted_skills?: Json
          is_saved?: boolean
          job_title?: string | null
          last_reanalyzed_at?: string
          match_score: number
          raw_jd_text: string
          seniority_level?: string | null
          skills_breakdown?: Json
          user_id: string
        }
        Update: {
          action_plan?: Json
          analysis_id?: string
          company_name?: string | null
          created_at?: string
          cv_skills_contributed?: number | null
          extracted_skills?: Json
          is_saved?: boolean
          job_title?: string | null
          last_reanalyzed_at?: string
          match_score?: number
          raw_jd_text?: string
          seniority_level?: string | null
          skills_breakdown?: Json
          user_id?: string
        }
        Relationships: []
      }
      paths: {
        Row: {
          is_active: boolean
          name: string
          path_id: string
          short_description: string
        }
        Insert: {
          is_active?: boolean
          name: string
          path_id: string
          short_description: string
        }
        Update: {
          is_active?: boolean
          name?: string
          path_id?: string
          short_description?: string
        }
        Relationships: []
      }
      project_skills: {
        Row: {
          project_id: string
          skill_id: string
        }
        Insert: {
          project_id: string
          skill_id: string
        }
        Update: {
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["skill_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          is_public_default: boolean
          project_id: string
          source_type: string | null
          stage_id: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          is_public_default?: boolean
          project_id?: string
          source_type?: string | null
          stage_id?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          is_public_default?: boolean
          project_id?: string
          source_type?: string | null
          stage_id?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["stage_id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          is_verified: boolean | null
          name: string
          skill_id: string
        }
        Insert: {
          category: string
          is_verified?: boolean | null
          name: string
          skill_id: string
        }
        Update: {
          category?: string
          is_verified?: boolean | null
          name?: string
          skill_id?: string
        }
        Relationships: []
      }
      stages: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          order_index: number
          path_id: string
          stage_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          order_index: number
          path_id: string
          stage_id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          order_index?: number
          path_id?: string
          stage_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "stages_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["path_id"]
          },
        ]
      }
      topic_resources: {
        Row: {
          content: string | null
          cost_note: string | null
          cost_type: string | null
          created_at: string
          order_index: number
          provider: string | null
          resource_id: string
          resource_type: string
          title: string | null
          topic_id: string
          url: string | null
        }
        Insert: {
          content?: string | null
          cost_note?: string | null
          cost_type?: string | null
          created_at?: string
          order_index: number
          provider?: string | null
          resource_id?: string
          resource_type: string
          title?: string | null
          topic_id: string
          url?: string | null
        }
        Update: {
          content?: string | null
          cost_note?: string | null
          cost_type?: string | null
          created_at?: string
          order_index?: number
          provider?: string | null
          resource_id?: string
          resource_type?: string
          title?: string | null
          topic_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_resources_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      topic_skills: {
        Row: {
          skill_id: string
          topic_id: string
        }
        Insert: {
          skill_id: string
          topic_id: string
        }
        Update: {
          skill_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["skill_id"]
          },
          {
            foreignKeyName: "topic_skills_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          difficulty_level: string | null
          estimated_time_min: number | null
          is_mandatory: boolean
          order_index: number
          stage_id: string
          summary: string | null
          title: string
          topic_id: string
          topic_type: string
        }
        Insert: {
          created_at?: string
          difficulty_level?: string | null
          estimated_time_min?: number | null
          is_mandatory?: boolean
          order_index: number
          stage_id: string
          summary?: string | null
          title: string
          topic_id?: string
          topic_type: string
        }
        Update: {
          created_at?: string
          difficulty_level?: string | null
          estimated_time_min?: number | null
          is_mandatory?: boolean
          order_index?: number
          stage_id?: string
          summary?: string | null
          title?: string
          topic_id?: string
          topic_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["stage_id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_accessed_at: string
          status: string
          topic_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_accessed_at?: string
          status?: string
          topic_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_accessed_at?: string
          status?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      user_projects: {
        Row: {
          completed_at: string | null
          created_at: string
          demo_url: string | null
          github_url: string | null
          id: string
          is_public: boolean
          personal_note: string | null
          project_id: string
          status: string
          tech_stack: string[] | null
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          demo_url?: string | null
          github_url?: string | null
          id?: string
          is_public: boolean
          personal_note?: string | null
          project_id: string
          status?: string
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          demo_url?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean
          personal_note?: string | null
          project_id?: string
          status?: string
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      user_skills: {
        Row: {
          is_public: boolean | null
          last_updated_at: string
          level: string
          skill_id: string
          source: string
          user_id: string
        }
        Insert: {
          is_public?: boolean | null
          last_updated_at?: string
          level?: string
          skill_id: string
          source: string
          user_id: string
        }
        Update: {
          is_public?: boolean | null
          last_updated_at?: string
          level?: string
          skill_id?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["skill_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: { Args: { query: string }; Returns: undefined }
      exec_temp_sql: { Args: { q: string }; Returns: undefined }
      increment_opportunity_analyses_count: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
