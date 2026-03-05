"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitDiscoveryForm(formId: string, slug: string, payload: any) {
  try {
    const supabase = await createClient();

    // 1. Insert into discovery_submissions
    const { error: insertError } = await supabase
      .from("discovery_submissions")
      .insert({
        form_id: formId,
        submitted_at: new Date().toISOString(),
        language: payload.language || "es",
        q_what: payload.q_what || null,
        q_why: payload.q_why || null,
        q_adjectives: payload.q_adjectives || null,
        q_ideal_client: payload.q_ideal_client || null,
        q_differentiator: payload.q_differentiator || null,
        q_perception_rank: payload.q_perception_rank || null,
        q_visual_refs: payload.q_visual_refs || null,
        q_accent_color: payload.q_accent_color || null,
        q_accent_color_name: payload.q_accent_color_name || null,
        q_visual_style: payload.q_visual_style || null,
        q_keep_elements: payload.q_keep_elements || null,
        q_voice_attrs: payload.q_voice_attrs || null,
        q_tagline: payload.q_tagline || null,
        q_tone_avoid: payload.q_tone_avoid || null,
        q_vision_5y: payload.q_vision_5y || null,
        q_market_gap: payload.q_market_gap || null,
        q_never: payload.q_never || null,
      });

    if (insertError) {
      console.error("Submission Insert Error:", insertError);
      return { error: "No se pudieron guardar las respuestas." };
    }

    // 2. Update discovery_forms status
    const { error: updateError } = await supabase
      .from("discovery_forms")
      .update({ status: "completed" })
      .eq("id", formId);

    if (updateError) {
      console.error("Form Update Error:", updateError);
      return { error: "Respuesta guardada, pero no se pudo actualizar el estado." };
    }

    // 3. Trigger Email/PDF via API route (background-ish)
    // We don't await this if we want speed, but for discovery, it's safer to wait or at least fire-and-forget
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      fetch(`${baseUrl}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, data: payload, language: payload.language || 'es' }),
      }).catch(err => console.error("API Trigger Error:", err));
    } catch (e) {
      console.error("Fetch implementation error:", e);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Submit Exception:", err);
    return { error: "Ocurrió un error inesperado al procesar tu solicitud." };
  }
}
