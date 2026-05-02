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
      admin_audit_log: {
        Row: {
          admin_id: string | null
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          ip_address: string | null
          log_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          ip_address?: string | null
          log_id?: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          ip_address?: string | null
          log_id?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          admin_level: string
          created_at: string
          display_name: string
          user_id: string
        }
        Insert: {
          admin_level?: string
          created_at?: string
          display_name: string
          user_id: string
        }
        Update: {
          admin_level?: string
          created_at?: string
          display_name?: string
          user_id?: string
        }
        Relationships: []
      }
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
      application_tracker: {
        Row: {
          analysis_id: string | null
          application_id: string
          company_name: string
          created_at: string | null
          date: string
          location: string | null
          notes: string | null
          posting_url: string | null
          role_title: string
          stage: Database["public"]["Enums"]["application_stage"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          application_id?: string
          company_name: string
          created_at?: string | null
          date?: string
          location?: string | null
          notes?: string | null
          posting_url?: string | null
          role_title: string
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          application_id?: string
          company_name?: string
          created_at?: string | null
          date?: string
          location?: string | null
          notes?: string | null
          posting_url?: string | null
          role_title?: string
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_tracker_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "opportunity_analyses"
            referencedColumns: ["analysis_id"]
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
      job_listings: {
        Row: {
          apply_url: string | null
          company: string
          created_at: string | null
          description: string | null
          employment_type: string | null
          expires_at: string | null
          is_remote: boolean | null
          job_id: string
          location: string
          path_id: string
          preferred_skills: Json | null
          published_at: string | null
          required_skills: Json | null
          seniority: Database["public"]["Enums"]["seniority_level"] | null
          source_url: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          expires_at?: string | null
          is_remote?: boolean | null
          job_id?: string
          location: string
          path_id: string
          preferred_skills?: Json | null
          published_at?: string | null
          required_skills?: Json | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          expires_at?: string | null
          is_remote?: boolean | null
          job_id?: string
          location?: string
          path_id?: string
          preferred_skills?: Json | null
          published_at?: string | null
          required_skills?: Json | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["path_id"]
          },
        ]
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
          location: string | null
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
          location?: string | null
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
          location?: string | null
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
      project_reviews: {
        Row: {
          created_at: string | null
          id: string
          improvements: string | null
          overall_verdict: Database["public"]["Enums"]["review_verdict"]
          recommended_topics: string[] | null
          requirements_results: Json
          score: number | null
          score_total: number | null
          strengths: string | null
          stretch_score: number | null
          submission_number: number | null
          user_project_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          improvements?: string | null
          overall_verdict: Database["public"]["Enums"]["review_verdict"]
          recommended_topics?: string[] | null
          requirements_results?: Json
          score?: number | null
          score_total?: number | null
          strengths?: string | null
          stretch_score?: number | null
          submission_number?: number | null
          user_project_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          improvements?: string | null
          overall_verdict?: Database["public"]["Enums"]["review_verdict"]
          recommended_topics?: string[] | null
          requirements_results?: Json
          score?: number | null
          score_total?: number | null
          strengths?: string | null
          stretch_score?: number | null
          submission_number?: number | null
          user_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_user_project_id_fkey"
            columns: ["user_project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          importance_level: string | null
          project_id: string
          skill_id: string
        }
        Insert: {
          importance_level?: string | null
          project_id: string
          skill_id: string
        }
        Update: {
          importance_level?: string | null
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
          core_requirements: string[] | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          effort_building: string | null
          effort_building_original: string | null
          effort_planning: string | null
          effort_planning_original: string | null
          effort_polish: string | null
          effort_polish_original: string | null
          is_active: boolean
          is_public_default: boolean
          overview: string | null
          project_id: string
          quality_signals: string[] | null
          recommended_tech: string[] | null
          source_type: string | null
          stage_id: string | null
          stretch_goals: string[] | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          core_requirements?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          effort_building?: string | null
          effort_building_original?: string | null
          effort_planning?: string | null
          effort_planning_original?: string | null
          effort_polish?: string | null
          effort_polish_original?: string | null
          is_active?: boolean
          is_public_default?: boolean
          overview?: string | null
          project_id?: string
          quality_signals?: string[] | null
          recommended_tech?: string[] | null
          source_type?: string | null
          stage_id?: string | null
          stretch_goals?: string[] | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          core_requirements?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          effort_building?: string | null
          effort_building_original?: string | null
          effort_planning?: string | null
          effort_planning_original?: string | null
          effort_polish?: string | null
          effort_polish_original?: string | null
          is_active?: boolean
          is_public_default?: boolean
          overview?: string | null
          project_id?: string
          quality_signals?: string[] | null
          recommended_tech?: string[] | null
          source_type?: string | null
          stage_id?: string | null
          stretch_goals?: string[] | null
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
      resume_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          is_visible: boolean | null
          resume_id: string
          section_id: string
          section_type: Database["public"]["Enums"]["resume_section_type"]
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          is_visible?: boolean | null
          resume_id: string
          section_id?: string
          section_type: Database["public"]["Enums"]["resume_section_type"]
          sort_order: number
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          is_visible?: boolean | null
          resume_id?: string
          section_id?: string
          section_type: Database["public"]["Enums"]["resume_section_type"]
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_sections_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["resume_id"]
          },
        ]
      }
      resumes: {
        Row: {
          ats_score: number | null
          created_at: string | null
          last_updated_at: string | null
          resume_id: string
          resume_type: Database["public"]["Enums"]["resume_type"] | null
          source_jd: Json | null
          status: Database["public"]["Enums"]["resume_status"] | null
          title: string | null
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string | null
          last_updated_at?: string | null
          resume_id?: string
          resume_type?: Database["public"]["Enums"]["resume_type"] | null
          source_jd?: Json | null
          status?: Database["public"]["Enums"]["resume_status"] | null
          title?: string | null
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string | null
          last_updated_at?: string | null
          resume_id?: string
          resume_type?: Database["public"]["Enums"]["resume_type"] | null
          source_jd?: Json | null
          status?: Database["public"]["Enums"]["resume_status"] | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
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
          importance_level: string | null
          skill_id: string
          topic_id: string
        }
        Insert: {
          importance_level?: string | null
          skill_id: string
          topic_id: string
        }
        Update: {
          importance_level?: string | null
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
          estimated_time_text: string | null
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
          estimated_time_text?: string | null
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
          estimated_time_text?: string | null
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
          bullets: string[] | null
          completed_at: string | null
          created_at: string
          demo_url: string | null
          draft_demo_url: string | null
          draft_github_url: string | null
          draft_requirements_done: string[] | null
          github_url: string | null
          id: string
          is_public: boolean
          key_highlights: string[] | null
          pdf_url: string | null
          personal_note: string | null
          project_description: string | null
          project_id: string
          project_name: string | null
          review_status: Database["public"]["Enums"]["review_status"] | null
          skipped: boolean | null
          skipped_at: string | null
          started_at: string | null
          status: string
          tech_stack: string[] | null
          tech_tags: string[] | null
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          bullets?: string[] | null
          completed_at?: string | null
          created_at?: string
          demo_url?: string | null
          draft_demo_url?: string | null
          draft_github_url?: string | null
          draft_requirements_done?: string[] | null
          github_url?: string | null
          id?: string
          is_public: boolean
          key_highlights?: string[] | null
          pdf_url?: string | null
          personal_note?: string | null
          project_description?: string | null
          project_id: string
          project_name?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          skipped?: boolean | null
          skipped_at?: string | null
          started_at?: string | null
          status?: string
          tech_stack?: string[] | null
          tech_tags?: string[] | null
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          bullets?: string[] | null
          completed_at?: string | null
          created_at?: string
          demo_url?: string | null
          draft_demo_url?: string | null
          draft_github_url?: string | null
          draft_requirements_done?: string[] | null
          github_url?: string | null
          id?: string
          is_public?: boolean
          key_highlights?: string[] | null
          pdf_url?: string | null
          personal_note?: string | null
          project_description?: string | null
          project_id?: string
          project_name?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          skipped?: boolean | null
          skipped_at?: string | null
          started_at?: string | null
          status?: string
          tech_stack?: string[] | null
          tech_tags?: string[] | null
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
      check_admin_access: {
        Args: never
        Returns: {
          admin_level: string
          display_name: string
          is_admin: boolean
        }[]
      }
      exec_sql: { Args: { query: string }; Returns: undefined }
      exec_temp_sql: { Args: { q: string }; Returns: undefined }
      increment_opportunity_analyses_count: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      log_admin_event: {
        Args: {
          p_admin_id: string
          p_description: string
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: string
          p_ip_address?: string
        }
        Returns: string
      }
    }
    Enums: {
      application_stage:
        | "saved"
        | "applied"
        | "in_review"
        | "interviewing"
        | "offer"
        | "accepted"
        | "rejected"
        | "withdrawn"
      job_status: "published" | "expired"
      resume_section_type:
        | "PERSONAL_INFO"
        | "SUMMARY"
        | "SKILLS"
        | "PROJECTS"
        | "EXPERIENCE"
        | "EDUCATION"
        | "CERTIFICATIONS"
      resume_status: "not_created" | "in_progress" | "ready"
      resume_type: "general" | "job_based"
      review_status: "none" | "pending" | "complete" | "failed"
      review_verdict: "strong" | "solid" | "needs_work"
      seniority_level: "Intern" | "Junior" | "Mid" | "Senior"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
