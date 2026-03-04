"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "Slug inválido"),
  directedTo: z.string().min(1, "El destinatario es requerido"),
  language: z.enum(["es", "en"]),
  expiresAt: z.string().optional(),
});

export async function checkSlugAvailability(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("discovery_forms")
    .select("id")
    .eq("slug", slug)
    .single();

  return !data; // Return true if no data matches (slug is available)
}

export async function createDiscoveryFormAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Debe iniciar sesión" };
    }

    const rawData = {
      clientName: formData.get("clientName") as string,
      slug: formData.get("slug") as string,
      directedTo: formData.get("directedTo") as string,
      language: formData.get("language") as string,
      expiresAt: formData.get("expiresAt") as string | undefined,
    };

    const validatedData = formSchema.parse(rawData);

    // Check slug again on server
    const isSlugAvail = await checkSlugAvailability(validatedData.slug);
    if (!isSlugAvail) {
      return { error: "El slug ya está en uso." };
    }

    let logoUrl = null;
    const logoFile = formData.get("logo") as File | null;

    if (logoFile && logoFile.size > 0) {
      if (logoFile.size > 2 * 1024 * 1024) {
        return { error: "El logo no debe superar los 2MB" };
      }

      const ext = logoFile.name.split('.').pop();
      const fileName = `${validatedData.slug}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, logoFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return { error: "Error subiendo el logo: " + uploadError.message };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);
        
      logoUrl = publicUrlData.publicUrl;
    }

    // Insert to DB
    const { data: newForm, error: insertError } = await supabase
      .from("discovery_forms")
      .insert({
        created_by: user.id,
        slug: validatedData.slug,
        client_name: validatedData.clientName,
        client_logo_url: logoUrl,
        directed_to: validatedData.directedTo,
        language: validatedData.language,
        status: "pending",
        expires_at: validatedData.expiresAt ? new Date(validatedData.expiresAt).toISOString() : null,
      })
      .select()
      .single();

    if (insertError) {
      return { error: "Error guardando el formulario: " + insertError.message };
    }

    revalidatePath("/[locale]/admin", "layout");
    return { success: true, formUrl: newForm.form_url, formId: newForm.id };

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message };
    }
    return { error: err.message || "Error al crear el formulario" };
  }
}
