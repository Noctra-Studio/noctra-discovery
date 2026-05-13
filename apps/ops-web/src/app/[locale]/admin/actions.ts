"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logout(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/admin/login`);
}

export async function deleteForm(formId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // RLS will ensure they only delete their own form
  const { error } = await supabase
    .from("discovery_forms")
    .delete()
    .eq("id", formId)
    .eq("created_by", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[locale]/admin", "layout");
  return { success: true };
}
