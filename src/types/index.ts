export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ServiceId = 'branding' | 'web' | 'seo' | 'ai-automations' | 'crm'

export const SERVICE_LABELS: Record<ServiceId, string> = {
  branding: 'Branding & Identidad Visual',
  web: 'Diseño Web / Landing Pages',
  seo: 'SEO',
  'ai-automations': 'AI Automations',
  crm: 'Noctra CRM / Forge',
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      discovery_forms: {
        Row: {
          id: string
          created_by: string
          slug: string
          client_name: string
          client_logo_url: string | null
          directed_to: string
          language: string
          status: string
          form_url: string | null
          created_at: string
          expires_at: string | null
          services: ServiceId[]
        }
        Insert: {
          id?: string
          created_by: string
          slug: string
          client_name: string
          client_logo_url?: string | null
          directed_to: string
          language?: string
          status?: string
          form_url?: never
          created_at?: string
          expires_at?: string | null
          services?: ServiceId[]
        }
        Update: {
          id?: string
          created_by?: string
          slug?: string
          client_name?: string
          client_logo_url?: string | null
          directed_to?: string
          language?: string
          status?: string
          form_url?: never
          created_at?: string
          expires_at?: string | null
          services?: ServiceId[]
        }
        Relationships: [
          {
            foreignKeyName: "discovery_forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      discovery_submissions: {
        Row: {
          id: string
          form_id: string
          submitted_at: string
          language: string
          q_what: string | null
          q_why: string | null
          q_client_voice: string | null
          q_ideal_client: string | null
          q_differentiator: string | null
          q_perception_rank: Json | null
          q_visual_inspiration: string | null
          q_visual_avoid: Json | null
          q_accent_color: string | null
          q_accent_color_name: string | null
          q_visual_style: Json | null
          q_keep_elements: string | null
          q_voice_attrs: Json | null
          q_concrete_result: string | null
          q_tone_avoid: string | null
          q_vision_5y: string | null
          q_market_gap: string | null
          q_never: string | null
          q_business_stage: 'starting' | 'established' | 'struggling' | 'relaunching' | null
          q_business_stage_detail: string | null
          q_origin: string | null
          q_previous_attempts: string | null
          q_internal_obstacle: string | null
          q_concrete_result_brand: string | null
          pdf_url: string | null
          email_sent_at: string | null
          // Web
          web_current_site: string | null
          web_pages: Json | null
          web_references: string[] | null
          web_features: Json | null
          web_content_owner: string | null
          web_integrations: string[] | null
          web_deadline: string | null
          web_goal: string | null
          // SEO
          seo_current_site: string | null
          seo_target_keywords: string | null
          seo_competitors: string | null
          seo_previous_attempts: string | null
          seo_content_capacity: string | null
          seo_goal: string | null
          seo_geo: string | null
          // AI Automations
          ai_current_tools: string | null
          ai_pain_points: string | null
          ai_processes: string[] | null
          ai_first_priority: string | null
          ai_team_size: string | null
          ai_budget_range: string | null
          // CRM
          crm_current_crm: string | null
          crm_previous_attempt: string | null
          crm_team_size: string | null
          crm_pipeline: string | null
          crm_integrations: string[] | null
          crm_main_goal: string | null
        }
        Insert: {
          id?: string
          form_id: string
          submitted_at?: string
          language?: string
          q_what?: string | null
          q_why?: string | null
          q_adjectives?: string | null
          q_ideal_client?: string | null
          q_differentiator?: string | null
          q_perception_rank?: Json | null
          q_visual_refs?: Json | null
          q_accent_color?: string | null
          q_accent_color_name?: string | null
          q_visual_style?: Json | null
          q_keep_elements?: string | null
          q_voice_attrs?: Json | null
          q_tagline?: string | null
          q_tone_avoid?: string | null
          q_vision_5y?: string | null
          q_market_gap?: string | null
          q_never?: string | null
          q_origin?: string | null
          q_previous_attempts?: string | null
          q_internal_obstacle?: string | null
          q_concrete_result_brand?: string | null
          web_goal?: string | null
          seo_goal?: string | null
          seo_geo?: string | null
          pdf_url?: string | null
          email_sent_at?: string | null
        }
        Update: {
          id?: string
          form_id?: string
          submitted_at?: string
          language?: string
          q_what?: string | null
          q_why?: string | null
          q_adjectives?: string | null
          q_ideal_client?: string | null
          q_differentiator?: string | null
          q_perception_rank?: Json | null
          q_visual_refs?: Json | null
          q_accent_color?: string | null
          q_accent_color_name?: string | null
          q_visual_style?: Json | null
          q_keep_elements?: string | null
          q_voice_attrs?: Json | null
          q_tagline?: string | null
          q_tone_avoid?: string | null
          q_vision_5y?: string | null
          q_market_gap?: string | null
          q_never?: string | null
          q_origin?: string | null
          q_previous_attempts?: string | null
          q_internal_obstacle?: string | null
          q_concrete_result_brand?: string | null
          web_goal?: string | null
          seo_goal?: string | null
          seo_geo?: string | null
          pdf_url?: string | null
          email_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: true
            referencedRelation: "discovery_forms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
