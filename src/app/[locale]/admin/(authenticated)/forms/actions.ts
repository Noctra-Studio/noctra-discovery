"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateSubmissionPDF } from "@/lib/submission-service";

export async function deleteForm(formId: string, locale: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("discovery_forms")
    .delete()
    .eq("id", formId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/${locale}/admin/forms`);
  return { success: true };
}

export async function regeneratePDFAction(submissionId: string, locale: string, formId: string) {
  try {
    const pdfUrl = await generateSubmissionPDF(submissionId);
    revalidatePath(`/${locale}/admin/forms/${formId}`);
    return { success: true, pdfUrl };
  } catch (err: any) {
    console.error("[actions.ts] Regenerate PDF Exception:", err);
    return { success: false, error: err.message || "Error al regenerar el PDF" };
  }
}
