export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          q_adjectives: string | null
          q_ideal_client: string | null
          q_differentiator: string | null
          q_perception_rank: Json | null
          q_visual_refs: Json | null
          q_accent_color: string | null
          q_accent_color_name: string | null
          q_visual_style: Json | null
          q_keep_elements: string | null
          q_voice_attrs: Json | null
          q_tagline: string | null
          q_tone_avoid: string | null
          q_vision_5y: string | null
          q_market_gap: string | null
          q_never: string | null
          pdf_url: string | null
          email_sent_at: string | null
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
