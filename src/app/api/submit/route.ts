import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

import { buildPDFHtml } from "@/lib/pdf-template";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, data, language = 'es' } = body;

    if (!slug || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. VALIDATE FORM
    const { data: formMeta, error: formError } = await supabaseAdmin
      .from("discovery_forms")
      .select("*")
      .eq("slug", slug)
      .single();

    if (formError || !formMeta) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (formMeta.status === "completed") {
      return NextResponse.json({ error: "Form already completed" }, { status: 409 });
    }

    if (formMeta.expires_at && new Date(formMeta.expires_at) < new Date()) {
      return NextResponse.json({ error: "Form expired" }, { status: 410 });
    }

    // 2. SAVE TO DB (service role)
    // Extract service-specific fields from data if they exist
    const { data: subData, error: subError } = await supabaseAdmin
      .from("discovery_submissions")
      .insert({
        form_id: formMeta.id,
        responses: data,
        // Web
        web_pages: data.web_pages || null,
        web_type: data.web_type || null,
        // SEO
        seo_target_keywords: data.seo_target_keywords || null,
        // AI
        ai_processes: data.ai_processes || null,
        // CRM
        crm_pipeline: data.crm_pipeline || null,
      })
      .select()
      .single();

    if (subError) {
      console.error("Submission error:", subError);
      return NextResponse.json({ error: "Error saving submission" }, { status: 500 });
    }

    // Update status to completed
    await supabaseAdmin
      .from("discovery_forms")
      .update({ status: "completed" })
      .eq("id", formMeta.id);

    // 3. GENERATE PDF (try/catch to avoid failing the whole flow)
    let pdfUrl = null;
    let pdfBuffer: Buffer | null = null;
    try {
      const isLocal = process.env.NODE_ENV === "development";
      let browser;
      
      if (isLocal) {
         browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      } else {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: { width: 1200, height: 900 },
            executablePath: await chromium.executablePath(),
            headless: true,
        });
      }
      
      const page = await browser.newPage();
      await page.setContent(buildPDFHtml(data, language, formMeta), { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      const pdfBytes = await page.pdf({ 
        format: 'A4', 
        printBackground: true, 
        margin: { top: 0, right: 0, bottom: 0, left: 0 } 
      });
      await browser.close();

      pdfBuffer = Buffer.from(pdfBytes);

      // 4. UPLOAD TO STORAGE
      const fileName = `pdfs/${slug}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("discovery")
        .upload(fileName, pdfBuffer, {
          contentType: "application/pdf"
        });

      if (!uploadError) {
        // We get public url or signed url depending on bucket settings.
        // For now, let's just save the path
        const { data: publicUrlData } = supabaseAdmin.storage
            .from("discovery")
            .getPublicUrl(fileName);
        pdfUrl = publicUrlData.publicUrl;

        await supabaseAdmin
            .from("discovery_submissions")
            .update({ pdf_url: pdfUrl })
            .eq("id", subData.id);
      } else {
          console.error("PDF Upload Error", uploadError);
      }

    } catch (pdfErr) {
      console.error("Error generating/uploading PDF:", pdfErr);
      // We do not return 500 here, we just continue to email
    }

    // 5. SEND EMAIL
    try {
      const activeServices = formMeta.services || ["branding"];
      const serviceDisplayNames = activeServices.map((s: string) => s.toUpperCase());

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #00E5A0;">Discovery Completado 🎉</h2>
          <p><strong>Cliente:</strong> ${formMeta.client_name}</p>
          <p><strong>Servicios:</strong> ${serviceDisplayNames.join(", ")}</p>
          <p><strong>Destinatario original:</strong> ${formMeta.directed_to}</p>
          <p><strong>Id Submisión:</strong> ${subData.id}</p>
          
          <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Resumen Common</h3>
            <p><strong>One Liner:</strong> ${data.q_company_one_liner || '-'}</p>
            <p><strong>Diferenciador:</strong> ${data.q_differentiator || '-'}</p>
          </div>

          ${activeServices.includes("branding") ? `
          <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Branding</h3>
            <p><strong>Color Acento:</strong> ${data.q_accent_color || '-'} (${data.q_accent_color_name || ''})</p>
            <p><strong>Tagline:</strong> ${data.q_tagline || '-'}</p>
          </div>` : ''}

          ${activeServices.includes("web") ? `
          <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Web</h3>
            <p><strong>Tipo:</strong> ${data.web_type || '-'}</p>
            <p><strong>Páginas:</strong> ${Array.isArray(data.web_pages) ? data.web_pages.join(", ") : '-'}</p>
          </div>` : ''}
          
          <p style="margin-top: 30px; font-size: 14px;">
            Las respuestas completas están guardadas en Supabase.<br/>
            ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #111; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver PDF Completo</a>` : 'El PDF no está disponible públicamente, revisa el archivo adjunto.'}
          </p>
        </div>
      `;

      const attachments = pdfBuffer ? [
        {
          filename: `Discovery_${formMeta.client_name.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer.toString("base64"),
        }
      ] : [];

      await resend.emails.send({
        from: "Noctra Studio <hello@noctra.studio>",
        to: ["hello@noctra.studio"],
        subject: `Discovery completado — ${formMeta.client_name}`,
        html: emailHtml,
        attachments: attachments
      });
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
    }

    // 6. RESPOND
    return NextResponse.json({ success: true, pdfUrl });
  } catch (error) {
    console.error("Unhandled error in submit route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const maxDuration = 60; // For Vercel hosting
