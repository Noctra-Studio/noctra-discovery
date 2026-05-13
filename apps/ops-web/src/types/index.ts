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

export type ProposalStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "changes_requested"
  | "rejected"
  | "cancelled";

export type DiscountType = "percentage" | "fixed";
export type ContractStatus = "draft" | "sent" | "signed" | "cancelled";

export interface ServiceItem {
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PaymentScheduleItem {
  percentage: number;
  amount: number;
  description: string;
  due_date?: string;
  trigger?: string;
}

export interface Proposal {
  id: string;
  slug?: string | null;
  status: ProposalStatus;
  language?: "en" | "es" | null;
  client_name: string;
  client_email: string;
  client_company?: string | null;
  client_phone?: string | null;
  project_name: string;
  project_description?: string | null;
  services: ServiceItem[];
  subtotal: number;
  discount_type?: DiscountType | null;
  discount_value?: number | null;
  discount_amount?: number | null;
  subtotal_after_discount?: number | null;
  iva_percentage?: number | null;
  iva_amount?: number | null;
  total: number;
  payment_terms?: string | null;
  delivery_weeks?: number | null;
  estimated_weeks?: number | null;
  valid_until?: string | null;
  notes?: string | null;
  service_type?: string | null;
  title: string;
  workspace_id?: string | null;
  created_at?: string | null;
}

export interface Contract {
  id: string;
  proposal_id?: string | null;
  project_id?: string | null;
  slug?: string | null;
  status?: ContractStatus | null;
  language?: "en" | "es" | null;
  client_name: string;
  client_company?: string | null;
  client_email: string;
  client_rfc?: string | null;
  client_address?: string | null;
  project_name?: string | null;
  services?: ServiceItem[] | null;
  payment_schedule?: PaymentScheduleItem[] | null;
  estimated_weeks?: number | null;
  start_date?: string | null;
  total?: number | null;
  total_price: number;
  service_type: string;
  workspace_id?: string | null;
  created_at?: string | null;
  signed_at?: string | null;
}

// Tipos generados automáticamente desde noctra-studio-db
// Para regenerar: npx supabase gen types typescript --project-id igvktmwoxfzfxfnctdhv > packages/db-types/src/database.types.ts
export type { Database } from '@noctra-ops/db-types'
