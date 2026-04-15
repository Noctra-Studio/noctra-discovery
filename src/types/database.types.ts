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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          project_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          project_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          project_id?: string
        }
        Relationships: []
      }
      brand_discovery: {
        Row: {
          client_slug: string
          data: Json
          id: string
          submitted_at: string | null
        }
        Insert: {
          client_slug: string
          data: Json
          id?: string
          submitted_at?: string | null
        }
        Update: {
          client_slug?: string
          data?: Json
          id?: string
          submitted_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          closed_at: string | null
          created_at: string | null
          email: string
          email_sent: boolean | null
          email_sent_at: string | null
          estimated_value: number | null
          id: string
          intent: string | null
          lead_score: number | null
          lead_score_breakdown: Json | null
          locale: string | null
          lost_reason: string | null
          message: string | null
          name: string
          next_action: string | null
          next_action_date: string | null
          phone: string | null
          pipeline_status: string | null
          request_id: string | null
          service_interest: string | null
          source_cta: string | null
          source_page: string | null
          workspace_id: string | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          email: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          estimated_value?: number | null
          id?: string
          intent?: string | null
          lead_score?: number | null
          lead_score_breakdown?: Json | null
          locale?: string | null
          lost_reason?: string | null
          message?: string | null
          name: string
          next_action?: string | null
          next_action_date?: string | null
          phone?: string | null
          pipeline_status?: string | null
          request_id?: string | null
          service_interest?: string | null
          source_cta?: string | null
          source_page?: string | null
          workspace_id?: string | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          email?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          estimated_value?: number | null
          id?: string
          intent?: string | null
          lead_score?: number | null
          lead_score_breakdown?: Json | null
          locale?: string | null
          lost_reason?: string | null
          message?: string | null
          name?: string
          next_action?: string | null
          next_action_date?: string | null
          phone?: string | null
          pipeline_status?: string | null
          request_id?: string | null
          service_interest?: string | null
          source_cta?: string | null
          source_page?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          clauses: Json | null
          client_address: string | null
          client_company: string | null
          client_email: string
          client_name: string
          client_rfc: string | null
          client_signature_data: string | null
          client_signature_hash: string | null
          client_signature_ip: string | null
          client_signed: boolean | null
          client_signed_at: string | null
          client_signed_name: string | null
          client_token: string | null
          contract_number: string | null
          created_at: string | null
          deliverables: Json | null
          document_hash: string | null
          estimated_weeks: number | null
          id: string
          items: Json | null
          lead_id: string | null
          noctra_signature_data: string | null
          noctra_signed: boolean | null
          noctra_signed_at: string | null
          payment_terms: string | null
          project_id: string | null
          proposal_id: string | null
          service_type: string
          signed_by_client: boolean | null
          start_date: string | null
          status: string | null
          total_price: number
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          clauses?: Json | null
          client_address?: string | null
          client_company?: string | null
          client_email: string
          client_name: string
          client_rfc?: string | null
          client_signature_data?: string | null
          client_signature_hash?: string | null
          client_signature_ip?: string | null
          client_signed?: boolean | null
          client_signed_at?: string | null
          client_signed_name?: string | null
          client_token?: string | null
          contract_number?: string | null
          created_at?: string | null
          deliverables?: Json | null
          document_hash?: string | null
          estimated_weeks?: number | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          noctra_signature_data?: string | null
          noctra_signed?: boolean | null
          noctra_signed_at?: string | null
          payment_terms?: string | null
          project_id?: string | null
          proposal_id?: string | null
          service_type: string
          signed_by_client?: boolean | null
          start_date?: string | null
          status?: string | null
          total_price: number
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          clauses?: Json | null
          client_address?: string | null
          client_company?: string | null
          client_email?: string
          client_name?: string
          client_rfc?: string | null
          client_signature_data?: string | null
          client_signature_hash?: string | null
          client_signature_ip?: string | null
          client_signed?: boolean | null
          client_signed_at?: string | null
          client_signed_name?: string | null
          client_token?: string | null
          contract_number?: string | null
          created_at?: string | null
          deliverables?: Json | null
          document_hash?: string | null
          estimated_weeks?: number | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          noctra_signature_data?: string | null
          noctra_signed?: boolean | null
          noctra_signed_at?: string | null
          payment_terms?: string | null
          project_id?: string | null
          proposal_id?: string | null
          service_type?: string
          signed_by_client?: boolean | null
          start_date?: string | null
          status?: string | null
          total_price?: number
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activity_events: {
        Row: {
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          event_type: string
          id: string
          metadata: Json
          title: string
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          event_type: string
          id?: string
          metadata?: Json
          title: string
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          event_type?: string
          id?: string
          metadata?: Json
          title?: string
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activity_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          assigned_user_id: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          due_date: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          title: string
          workspace_id: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          title: string
          workspace_id?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_preferences: {
        Row: {
          created_at: string
          filters: Json
          id: string
          order_index: number
          size_variant: string
          updated_at: string
          user_id: string
          visible: boolean
          widget_key: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          order_index?: number
          size_variant?: string
          updated_at?: string
          user_id: string
          visible?: boolean
          widget_key: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          order_index?: number
          size_variant?: string
          updated_at?: string
          user_id?: string
          visible?: boolean
          widget_key?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_preferences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          created_at: string | null
          feedback_notes: string | null
          id: string
          preview_image_url: string | null
          project_id: string
          status: string | null
          tags: string[] | null
          title: string
          version_updates: Json | null
        }
        Insert: {
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          preview_image_url?: string | null
          project_id: string
          status?: string | null
          tags?: string[] | null
          title: string
          version_updates?: Json | null
        }
        Update: {
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          preview_image_url?: string | null
          project_id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          version_updates?: Json | null
        }
        Relationships: []
      }
      discovery_forms: {
        Row: {
          client_logo_url: string | null
          client_name: string
          created_at: string | null
          created_by: string
          directed_to: string
          expires_at: string | null
          form_url: string | null
          id: string
          language: string
          services: string[]
          slug: string
          status: string
          workspace_id: string
        }
        Insert: {
          client_logo_url?: string | null
          client_name: string
          created_at?: string | null
          created_by: string
          directed_to: string
          expires_at?: string | null
          form_url?: string | null
          id?: string
          language?: string
          services?: string[]
          slug: string
          status?: string
          workspace_id: string
        }
        Update: {
          client_logo_url?: string | null
          client_name?: string
          created_at?: string | null
          created_by?: string
          directed_to?: string
          expires_at?: string | null
          form_url?: string | null
          id?: string
          language?: string
          services?: string[]
          slug?: string
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_forms_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_submissions: {
        Row: {
          ai_first_priority: string | null
          ai_processes: Json | null
          crm_pipeline: string | null
          crm_previous_attempt: string | null
          email_sent_at: string | null
          form_id: string
          id: string
          language: string
          pdf_url: string | null
          q_accent_color: string | null
          q_accent_color_name: string | null
          q_adjectives: string | null
          q_business_stage: string | null
          q_business_stage_detail: string | null
          q_concrete_result: string | null
          q_concrete_result_brand: string | null
          q_differentiator: string | null
          q_ideal_client: string | null
          q_internal_obstacle: string | null
          q_keep_elements: string | null
          q_market_gap: string | null
          q_never: string | null
          q_origin: string | null
          q_perception_rank: Json | null
          q_previous_attempts: string | null
          q_tagline: string | null
          q_tone_avoid: string | null
          q_vision_5y: string | null
          q_visual_avoid: Json | null
          q_visual_inspiration: string | null
          q_visual_refs: Json | null
          q_visual_style: Json | null
          q_voice_attrs: Json | null
          q_what: string | null
          q_why: string | null
          responses: Json | null
          seo_goal: string | null
          seo_previous_attempts: string | null
          seo_target_keywords: string | null
          submitted_at: string | null
          web_content_owner: string | null
          web_current_site: string | null
          web_goal: string | null
          web_type: string | null
        }
        Insert: {
          ai_first_priority?: string | null
          ai_processes?: Json | null
          crm_pipeline?: string | null
          crm_previous_attempt?: string | null
          email_sent_at?: string | null
          form_id: string
          id?: string
          language?: string
          pdf_url?: string | null
          q_accent_color?: string | null
          q_accent_color_name?: string | null
          q_adjectives?: string | null
          q_business_stage?: string | null
          q_business_stage_detail?: string | null
          q_concrete_result?: string | null
          q_concrete_result_brand?: string | null
          q_differentiator?: string | null
          q_ideal_client?: string | null
          q_internal_obstacle?: string | null
          q_keep_elements?: string | null
          q_market_gap?: string | null
          q_never?: string | null
          q_origin?: string | null
          q_perception_rank?: Json | null
          q_previous_attempts?: string | null
          q_tagline?: string | null
          q_tone_avoid?: string | null
          q_vision_5y?: string | null
          q_visual_avoid?: Json | null
          q_visual_inspiration?: string | null
          q_visual_refs?: Json | null
          q_visual_style?: Json | null
          q_voice_attrs?: Json | null
          q_what?: string | null
          q_why?: string | null
          responses?: Json | null
          seo_goal?: string | null
          seo_previous_attempts?: string | null
          seo_target_keywords?: string | null
          submitted_at?: string | null
          web_content_owner?: string | null
          web_current_site?: string | null
          web_goal?: string | null
          web_type?: string | null
        }
        Update: {
          ai_first_priority?: string | null
          ai_processes?: Json | null
          crm_pipeline?: string | null
          crm_previous_attempt?: string | null
          email_sent_at?: string | null
          form_id?: string
          id?: string
          language?: string
          pdf_url?: string | null
          q_accent_color?: string | null
          q_accent_color_name?: string | null
          q_adjectives?: string | null
          q_business_stage?: string | null
          q_business_stage_detail?: string | null
          q_concrete_result?: string | null
          q_concrete_result_brand?: string | null
          q_differentiator?: string | null
          q_ideal_client?: string | null
          q_internal_obstacle?: string | null
          q_keep_elements?: string | null
          q_market_gap?: string | null
          q_never?: string | null
          q_origin?: string | null
          q_perception_rank?: Json | null
          q_previous_attempts?: string | null
          q_tagline?: string | null
          q_tone_avoid?: string | null
          q_vision_5y?: string | null
          q_visual_avoid?: Json | null
          q_visual_inspiration?: string | null
          q_visual_refs?: Json | null
          q_visual_style?: Json | null
          q_voice_attrs?: Json | null
          q_what?: string | null
          q_why?: string | null
          responses?: Json | null
          seo_goal?: string | null
          seo_previous_attempts?: string | null
          seo_target_keywords?: string | null
          submitted_at?: string | null
          web_content_owner?: string | null
          web_current_site?: string | null
          web_goal?: string | null
          web_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "discovery_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      document_envelopes: {
        Row: {
          contract_id: string | null
          created_at: string | null
          expires_at: string | null
          hash_token: string
          id: string
          pdf_path: string
          project_id: string | null
          proposal_id: string | null
          signed_pdf_path: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          hash_token?: string
          id?: string
          pdf_path: string
          project_id?: string | null
          proposal_id?: string | null
          signed_pdf_path?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          hash_token?: string
          id?: string
          pdf_path?: string
          project_id?: string | null
          proposal_id?: string | null
          signed_pdf_path?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_envelopes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          device_fingerprint: string | null
          envelope_id: string
          id: string
          ip_address: string | null
          signature_image_path: string | null
          signed_at: string | null
          signer_email: string
          signer_name: string
        }
        Insert: {
          device_fingerprint?: string | null
          envelope_id: string
          id?: string
          ip_address?: string | null
          signature_image_path?: string | null
          signed_at?: string | null
          signer_email: string
          signer_name: string
        }
        Update: {
          device_fingerprint?: string | null
          envelope_id?: string
          id?: string
          ip_address?: string | null
          signature_image_path?: string | null
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "document_envelopes"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_costs: {
        Row: {
          created_at: string | null
          hourly_cost: number
          id: string
          updated_at: string | null
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          created_at?: string | null
          hourly_cost?: number
          id?: string
          updated_at?: string | null
          user_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          created_at?: string | null
          hourly_cost?: number
          id?: string
          updated_at?: string | null
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      followup_templates: {
        Row: {
          body_en: string | null
          body_es: string | null
          created_at: string | null
          id: string
          subject_en: string | null
          subject_es: string | null
          trigger_event: string
        }
        Insert: {
          body_en?: string | null
          body_es?: string | null
          created_at?: string | null
          id?: string
          subject_en?: string | null
          subject_es?: string | null
          trigger_event: string
        }
        Update: {
          body_en?: string | null
          body_es?: string | null
          created_at?: string | null
          id?: string
          subject_en?: string | null
          subject_es?: string | null
          trigger_event?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          accounting_external_id: string | null
          accounting_sync_error: string | null
          accounting_sync_status:
            | Database["public"]["Enums"]["accounting_sync_status"]
            | null
          accounting_synced_at: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: number
          issue_date: string | null
          lead_id: number | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          tax_amount: number | null
          total: number | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          accounting_external_id?: string | null
          accounting_sync_error?: string | null
          accounting_sync_status?:
            | Database["public"]["Enums"]["accounting_sync_status"]
            | null
          accounting_synced_at?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: number
          issue_date?: string | null
          lead_id?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          total?: number | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          accounting_external_id?: string | null
          accounting_sync_error?: string | null
          accounting_sync_status?:
            | Database["public"]["Enums"]["accounting_sync_status"]
            | null
          accounting_synced_at?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: number
          issue_date?: string | null
          lead_id?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          total?: number | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: number
          language: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          language?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          language?: string | null
          name?: string | null
        }
        Relationships: []
      }
      migration_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          external_id: string | null
          id: string
          level: string
          message: string
          migration_id: string
          row_number: number | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          external_id?: string | null
          id?: string
          level: string
          message: string
          migration_id: string
          row_number?: number | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          external_id?: string | null
          id?: string
          level?: string
          message?: string
          migration_id?: string
          row_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_logs_migration_id_fkey"
            columns: ["migration_id"]
            isOneToOne: false
            referencedRelation: "migrations"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          completed_at: string | null
          config: Json
          created_at: string | null
          id: string
          source: string
          stats: Json
          status: string
          updated_at: string | null
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          source: string
          stats?: Json
          status?: string
          updated_at?: string | null
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          completed_at?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          source?: string
          stats?: Json
          status?: string
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "migrations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_deliverables: {
        Row: {
          client_comment: string | null
          client_token: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          project_id: string | null
          reviewed_at: string | null
          status: string | null
          title: string
          workspace_id: string | null
        }
        Insert: {
          client_comment?: string | null
          client_token?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          title: string
          workspace_id?: string | null
        }
        Update: {
          client_comment?: string | null
          client_token?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliverables_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_expenses: {
        Row: {
          amount: number
          concept: string
          created_at: string | null
          expense_date: string | null
          id: string
          project_id: string | null
          workspace_id: string | null
        }
        Insert: {
          amount: number
          concept: string
          created_at?: string | null
          expense_date?: string | null
          id?: string
          project_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string | null
          expense_date?: string | null
          id?: string
          project_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_expenses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          budget_allocated: number | null
          budget_spent: number | null
          id: string
          name: string
          progress_percentage: number | null
          project_id: string
          status: string | null
        }
        Insert: {
          budget_allocated?: number | null
          budget_spent?: number | null
          id?: string
          name: string
          progress_percentage?: number | null
          project_id: string
          status?: string | null
        }
        Update: {
          budget_allocated?: number | null
          budget_spent?: number | null
          id?: string
          name?: string
          progress_percentage?: number | null
          project_id?: string
          status?: string | null
        }
        Relationships: []
      }
      project_status_history: {
        Row: {
          changed_at: string | null
          id: string
          project_id: string | null
          status: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          project_id?: string | null
          status: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          project_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_status_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          phase: string
          project_id: string | null
          sort_order: number | null
          title: string
          workspace_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          phase: string
          project_id?: string | null
          sort_order?: number | null
          title: string
          workspace_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          phase?: string
          project_id?: string | null
          sort_order?: number | null
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_time_logs: {
        Row: {
          created_at: string | null
          description: string | null
          hours: number
          id: string
          logged_at: string | null
          project_id: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hours: number
          id?: string
          logged_at?: string | null
          project_id?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hours?: number
          id?: string
          logged_at?: string | null
          project_id?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_time_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_time_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          case_study_enabled: boolean | null
          challenge: string | null
          client_company: string | null
          client_email: string | null
          client_name: string | null
          contract_id: string | null
          created_at: string | null
          deadline: string | null
          form_description: string | null
          gallery: Json | null
          has_ai_form: boolean | null
          hourly_rate: number | null
          id: string
          industry: string | null
          internal_notes: string | null
          launch_date: string | null
          lead_id: string | null
          metrics: Json | null
          name: string
          published_to_site: boolean
          report_config: Json | null
          report_generated_at: string | null
          report_token: string | null
          results: string | null
          slug: string
          solution: string | null
          sort_order: number | null
          start_date: string | null
          status: string
          tagline: string | null
          total_expenses: number | null
          total_hours: number | null
          updated_at: string | null
          visible: boolean | null
          workspace_id: string | null
        }
        Insert: {
          budget?: number | null
          case_study_enabled?: boolean | null
          challenge?: string | null
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          contract_id?: string | null
          created_at?: string | null
          deadline?: string | null
          form_description?: string | null
          gallery?: Json | null
          has_ai_form?: boolean | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          launch_date?: string | null
          lead_id?: string | null
          metrics?: Json | null
          name: string
          published_to_site?: boolean
          report_config?: Json | null
          report_generated_at?: string | null
          report_token?: string | null
          results?: string | null
          slug: string
          solution?: string | null
          sort_order?: number | null
          start_date?: string | null
          status: string
          tagline?: string | null
          total_expenses?: number | null
          total_hours?: number | null
          updated_at?: string | null
          visible?: boolean | null
          workspace_id?: string | null
        }
        Update: {
          budget?: number | null
          case_study_enabled?: boolean | null
          challenge?: string | null
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          contract_id?: string | null
          created_at?: string | null
          deadline?: string | null
          form_description?: string | null
          gallery?: Json | null
          has_ai_form?: boolean | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          launch_date?: string | null
          lead_id?: string | null
          metrics?: Json | null
          name?: string
          published_to_site?: boolean
          report_config?: Json | null
          report_generated_at?: string | null
          report_token?: string | null
          results?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string
          tagline?: string | null
          total_expenses?: number | null
          total_hours?: number | null
          updated_at?: string | null
          visible?: boolean | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_activities: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          performed_by: string | null
          proposal_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          performed_by?: string | null
          proposal_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          performed_by?: string | null
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_activities_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_events: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          metadata: Json | null
          proposal_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          metadata?: Json | null
          proposal_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          metadata?: Json | null
          proposal_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_events_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          proposal_id: string
          quantity: number | null
          sort_order: number | null
          total: number | null
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          proposal_id: string
          quantity?: number | null
          sort_order?: number | null
          total?: number | null
          unit_price: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          proposal_id?: string
          quantity?: number | null
          sort_order?: number | null
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_signatures: {
        Row: {
          id: string
          ip_address: unknown
          proposal_id: string
          signature_data: string
          signature_type: string
          signed_at: string | null
          signer_email: string
          signer_name: string
          signer_title: string | null
          terms_accepted: boolean | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown
          proposal_id: string
          signature_data: string
          signature_type?: string
          signed_at?: string | null
          signer_email: string
          signer_name: string
          signer_title?: string | null
          terms_accepted?: boolean | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown
          proposal_id?: string
          signature_data?: string
          signature_type?: string
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
          signer_title?: string | null
          terms_accepted?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_signatures_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: true
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          accepted_at: string | null
          addons: Json | null
          base_price: number | null
          client_company: string | null
          client_email: string | null
          client_name: string | null
          client_token: string | null
          created_at: string | null
          created_project_id: string | null
          currency: string | null
          deliverables: Json | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          estimated_duration: string | null
          estimated_weeks: number | null
          id: string
          lead_id: string | null
          notes: string | null
          payment_custom: string | null
          payment_terms: string | null
          problem_statement: string | null
          proposal_number: string | null
          proposed_solution: string | null
          public_uuid: string
          rejected_at: string | null
          sent_at: string | null
          service_type: string | null
          signature_data: string | null
          signature_hash: string | null
          signature_ip: string | null
          signed: boolean | null
          signed_at: string | null
          signed_name: string | null
          start_date: string | null
          status: string
          subtotal: number | null
          tax_percentage: number | null
          title: string
          total: number | null
          total_price: number | null
          updated_at: string | null
          valid_until: string | null
          view_count: number | null
          viewed_at: string | null
          workspace_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          addons?: Json | null
          base_price?: number | null
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          client_token?: string | null
          created_at?: string | null
          created_project_id?: string | null
          currency?: string | null
          deliverables?: Json | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          estimated_duration?: string | null
          estimated_weeks?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_custom?: string | null
          payment_terms?: string | null
          problem_statement?: string | null
          proposal_number?: string | null
          proposed_solution?: string | null
          public_uuid?: string
          rejected_at?: string | null
          sent_at?: string | null
          service_type?: string | null
          signature_data?: string | null
          signature_hash?: string | null
          signature_ip?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_name?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number | null
          tax_percentage?: number | null
          title: string
          total?: number | null
          total_price?: number | null
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
          viewed_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          addons?: Json | null
          base_price?: number | null
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          client_token?: string | null
          created_at?: string | null
          created_project_id?: string | null
          currency?: string | null
          deliverables?: Json | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          estimated_duration?: string | null
          estimated_weeks?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_custom?: string | null
          payment_terms?: string | null
          problem_statement?: string | null
          proposal_number?: string | null
          proposed_solution?: string | null
          public_uuid?: string
          rejected_at?: string | null
          sent_at?: string | null
          service_type?: string | null
          signature_data?: string | null
          signature_hash?: string | null
          signature_ip?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_name?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number | null
          tax_percentage?: number | null
          title?: string
          total?: number | null
          total_price?: number | null
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
          viewed_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          company_name: string | null
          converted_at: string | null
          converted_to_profile_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          converted_at?: string | null
          converted_to_profile_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          converted_at?: string | null
          converted_to_profile_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          attempts: number | null
          first_attempt_at: string | null
          id: string
          ip: string
          last_attempt_at: string | null
        }
        Insert: {
          attempts?: number | null
          first_attempt_at?: string | null
          id?: string
          ip: string
          last_attempt_at?: string | null
        }
        Update: {
          attempts?: number | null
          first_attempt_at?: string | null
          id?: string
          ip?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      tax_profiles: {
        Row: {
          created_at: string | null
          email_invoice: string | null
          id: string
          lead_id: number
          legal_name: string
          rfc_vat_id: string
          tax_address: string | null
          tax_regime: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          email_invoice?: string | null
          id?: string
          lead_id: number
          legal_name: string
          rfc_vat_id: string
          tax_address?: string | null
          tax_regime?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          email_invoice?: string | null
          id?: string
          lead_id?: number
          legal_name?: string
          rfc_vat_id?: string
          tax_address?: string | null
          tax_regime?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_profiles_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_status: {
        Row: {
          current_status: string | null
          current_task: string | null
          id: string
          last_updated: string | null
          project_id: string
          worker_avatar_url: string | null
          worker_name: string
        }
        Insert: {
          current_status?: string | null
          current_task?: string | null
          id?: string
          last_updated?: string | null
          project_id: string
          worker_avatar_url?: string | null
          worker_name: string
        }
        Update: {
          current_status?: string | null
          current_task?: string | null
          id?: string
          last_updated?: string | null
          project_id?: string
          worker_avatar_url?: string | null
          worker_name?: string
        }
        Relationships: []
      }
      user_dashboard_filters: {
        Row: {
          filter_key: string
          filter_value: Json
          id: string
          updated_at: string
          user_id: string
          widget_key: string
          workspace_id: string
        }
        Insert: {
          filter_key: string
          filter_value?: Json
          id?: string
          updated_at?: string
          user_id: string
          widget_key: string
          workspace_id: string
        }
        Update: {
          filter_key?: string
          filter_value?: Json
          id?: string
          updated_at?: string
          user_id?: string
          widget_key?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dashboard_filters_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_preferences: {
        Row: {
          created_at: string
          order_index: number
          size_variant: string
          updated_at: string
          user_id: string
          visible: boolean
          widget_key: string
          widget_preferences: Json
          workspace_id: string
        }
        Insert: {
          created_at?: string
          order_index?: number
          size_variant?: string
          updated_at?: string
          user_id: string
          visible?: boolean
          widget_key: string
          widget_preferences?: Json
          workspace_id: string
        }
        Update: {
          created_at?: string
          order_index?: number
          size_variant?: string
          updated_at?: string
          user_id?: string
          visible?: boolean
          widget_key?: string
          widget_preferences?: Json
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dashboard_preferences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workspace_activity_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          event_type: string
          id: string
          metadata: Json
          title: string
          workspace_id: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          event_type: string
          id?: string
          metadata?: Json
          title: string
          workspace_id: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          event_type?: string
          id?: string
          metadata?: Json
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_activity_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_config: {
        Row: {
          contract_clauses: Json | null
          created_at: string | null
          default_hourly_rate: number | null
          id: string
          pipeline_stages: Json | null
          proposal_footer: string | null
          service_types: Json | null
          workspace_id: string | null
        }
        Insert: {
          contract_clauses?: Json | null
          created_at?: string | null
          default_hourly_rate?: number | null
          id?: string
          pipeline_stages?: Json | null
          proposal_footer?: string | null
          service_types?: Json | null
          workspace_id?: string | null
        }
        Update: {
          contract_clauses?: Json | null
          created_at?: string | null
          default_hourly_rate?: number | null
          id?: string
          pipeline_stages?: Json | null
          proposal_footer?: string | null
          service_types?: Json | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_config_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          ai_credits_balance: number
          country: string | null
          created_at: string | null
          currency: string | null
          custom_domain: string | null
          email: string
          folio_prefix: string
          id: string
          is_active: boolean | null
          is_ai_unlimited: boolean
          locale: string
          logo_url: string | null
          name: string
          plan: string | null
          primary_color: string | null
          slug: string
          subdomain: string | null
          tier: string
          website: string | null
          workspace_type: string
        }
        Insert: {
          ai_credits_balance?: number
          country?: string | null
          created_at?: string | null
          currency?: string | null
          custom_domain?: string | null
          email: string
          folio_prefix?: string
          id?: string
          is_active?: boolean | null
          is_ai_unlimited?: boolean
          locale?: string
          logo_url?: string | null
          name: string
          plan?: string | null
          primary_color?: string | null
          slug: string
          subdomain?: string | null
          tier?: string
          website?: string | null
          workspace_type?: string
        }
        Update: {
          ai_credits_balance?: number
          country?: string | null
          created_at?: string | null
          currency?: string | null
          custom_domain?: string | null
          email?: string
          folio_prefix?: string
          id?: string
          is_active?: boolean | null
          is_ai_unlimited?: boolean
          locale?: string
          logo_url?: string | null
          name?: string
          plan?: string | null
          primary_color?: string | null
          slug?: string
          subdomain?: string | null
          tier?: string
          website?: string | null
          workspace_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_project_profitability: {
        Args: { target_project_id: string }
        Returns: Json
      }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      convert_prospect_to_client: {
        Args: { p_proposal_id: string; p_signature_id: string }
        Returns: Json
      }
      get_leads_needing_attention: {
        Args: { p_workspace_id: string }
        Returns: {
          created_at: string
          email: string
          id: string
          lead_score: number
          name: string
          next_action: string
          next_action_date: string
          phone: string
          pipeline_status: string
          reason: string
          service_interest: string
        }[]
      }
      get_next_proposal_number: { Args: never; Returns: string }
      get_next_request_id: { Args: never; Returns: number }
      has_workspace_role: {
        Args: { allowed_roles: string[]; target_workspace_id: string }
        Returns: boolean
      }
      increment_workspace_tokens: {
        Args: { amount: number; workspacecode: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_workspace_member: { Args: { ws_id: string }; Returns: boolean }
    }
    Enums: {
      accounting_sync_status: "pending" | "synced" | "error"
      deliverable_status: "pending_review" | "approved" | "changes_requested"
      document_status: "sent" | "viewed" | "signed"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      project_status:
        | "discovery"
        | "architecture"
        | "building"
        | "launch"
        | "maintenance"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "resolved"
      user_role: "admin" | "client"
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
    Enums: {
      accounting_sync_status: ["pending", "synced", "error"],
      deliverable_status: ["pending_review", "approved", "changes_requested"],
      document_status: ["sent", "viewed", "signed"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      project_status: [
        "discovery",
        "architecture",
        "building",
        "launch",
        "maintenance",
      ],
      ticket_priority: ["low", "medium", "high"],
      ticket_status: ["open", "in_progress", "resolved"],
      user_role: ["admin", "client"],
    },
  },
} as const
