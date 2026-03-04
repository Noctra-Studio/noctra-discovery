"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
