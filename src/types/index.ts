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

// Tipos generados automáticamente desde noctra-studio-db
// Para regenerar: npx supabase gen types typescript --project-id igvktmwoxfzfxfnctdhv > src/types/database.types.ts
export type { Database } from './database.types'