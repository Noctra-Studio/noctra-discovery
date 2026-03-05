import { z } from "zod";

const MAX_TEXT_LENGTH = 2000;
const MAX_SHORT_LENGTH = 200;

export const submissionSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug invalid"),
    
  language: z.enum(["es", "en"]).optional().default("es"),

  data: z.object({
    // Sección común
    q_company_one_liner: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_company_why: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_business_stage: z
      .enum(["starting", "established", "struggling", "relaunching"])
      .optional().nullable(),
    q_business_stage_detail: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_client_voice: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_ideal_client: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_concrete_result: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_differentiator: z.string().max(MAX_TEXT_LENGTH).optional(),

    // Branding
    q_perception_rank: z.array(z.string().max(100)).max(10).optional(),
    q_visual_inspiration: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_visual_avoid: z.array(z.string().max(100)).max(10).optional(),
    q_accent_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional().or(z.literal("")),
    q_accent_color_name: z.string().max(50).optional(),
    q_visual_style: z.array(z.string().max(100)).max(10).optional(),
    q_keep_elements: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_voice_attrs: z.array(z.string().max(100)).max(10).optional(),
    q_tone_avoid: z.string().max(MAX_TEXT_LENGTH).optional(),
    q_never: z.string().max(MAX_TEXT_LENGTH).optional(),

    // Web
    web_current_site: z.string().max(MAX_TEXT_LENGTH).optional(),
    web_goal: z.string().max(MAX_TEXT_LENGTH).optional(),
    web_type: z.string().max(MAX_SHORT_LENGTH).optional(),
    web_content_owner: z.string().max(MAX_SHORT_LENGTH).optional(),
    web_features: z.array(z.string().max(100)).max(20).optional(),
    web_integrations: z.array(z.string().max(100)).max(20).optional(),
    web_deadline: z.string().max(MAX_SHORT_LENGTH).optional(),
    web_pages: z.array(z.string().max(100)).max(20).optional(),
    web_references: z.string().max(MAX_TEXT_LENGTH).optional(),

    // SEO
    seo_current_site: z.string().max(MAX_SHORT_LENGTH).optional(),
    seo_target_keywords: z.string().max(MAX_TEXT_LENGTH).optional(),
    seo_competitors: z.string().max(MAX_TEXT_LENGTH).optional(),
    seo_previous_attempts: z.string().max(MAX_TEXT_LENGTH).optional(),
    seo_content_capacity: z.string().max(MAX_SHORT_LENGTH).optional(),
    seo_geo: z.string().max(MAX_SHORT_LENGTH).optional(),
    seo_current_traffic: z.string().max(MAX_SHORT_LENGTH).optional(),
    seo_goal: z.string().max(MAX_TEXT_LENGTH).optional(),

    // AI
    ai_current_tools: z.string().max(MAX_TEXT_LENGTH).optional(),
    ai_pain_points: z.string().max(MAX_TEXT_LENGTH).optional(),
    ai_first_priority: z.string().max(MAX_TEXT_LENGTH).optional(),
    ai_processes: z.array(z.string().max(100)).max(20).optional(),
    ai_team_size: z.string().max(MAX_SHORT_LENGTH).optional(),
    ai_tech_level: z.string().max(MAX_SHORT_LENGTH).optional(),
    ai_budget_range: z.string().max(MAX_SHORT_LENGTH).optional(),
    ai_timeline: z.string().max(MAX_SHORT_LENGTH).optional(),

    // CRM
    crm_current_crm: z.string().max(MAX_SHORT_LENGTH).optional(),
    crm_previous_attempt: z.string().max(MAX_TEXT_LENGTH).optional(),
    crm_pain_points: z.string().max(MAX_TEXT_LENGTH).optional(),
    crm_pipeline: z.string().max(MAX_TEXT_LENGTH).optional(),
    crm_team_size: z.string().max(MAX_SHORT_LENGTH).optional(),
    crm_avg_deals: z.string().max(MAX_TEXT_LENGTH).optional(),
    crm_main_goal: z.string().max(MAX_TEXT_LENGTH).optional(),
    crm_integrations: z.array(z.string().max(100)).max(20).optional(),
    crm_ai_features: z.array(z.string().max(100)).max(20).optional(),
  }),
});

export type SubmissionPayload = z.infer<typeof submissionSchema>;
