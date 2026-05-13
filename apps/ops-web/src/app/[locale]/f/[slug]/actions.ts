"use server";

import { processSubmission } from "@/lib/submission-service";

export async function submitDiscoveryForm(formId: string, slug: string, payload: any) {
  try {
    // We delegate the entire transaction (DB, PDF, Email) to the shared service
    // This avoids 409 conflicts and "Fetch failed" loopback issues.
    const result = await processSubmission(slug, payload, payload.language || 'es');

    return { 
      success: true, 
      emailSent: result.emailSent, 
      emailError: result.emailError 
    };
    
  } catch (err: any) {
    console.error("[actions.ts] Submit Exception:", err);
    
    if (err.message === "Form already completed") {
       return { success: true }; // Silent success for UI if already done
    }
    
    return { error: err.message || "Ocurrió un error inesperado al procesar tu solicitud." };
  }
}
