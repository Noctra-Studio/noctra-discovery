import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { Resend } from "resend";
import { buildPDFHtml } from "./pdf-template";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function processSubmission(slug: string, data: any, language: string = 'es') {
  console.log(`[submission-service] Processing submission for slug: ${slug}`);

  // 1. VALIDATE FORM
  const { data: formMeta, error: formError } = await supabaseAdmin
    .from("discovery_forms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (formError || !formMeta) {
    throw new Error("Form not found");
  }

  if (formMeta.status === "completed") {
    // If it's already completed, we might want to return success but skip email/pdf 
    // or just allow it if it's within a short window.
    // For now, let's treat it as a conflict to avoid double-processing.
    throw new Error("Form already completed");
  }

  // 2. SAVE TO DB
  const { data: subData, error: subError } = await supabaseAdmin
    .from("discovery_submissions")
    .insert({
      form_id: formMeta.id,
      responses: data,
      language: language,
      // Mapping fields for the dashboard search/filters
      web_type: data.web_type || null,
      web_current_site: data.web_current_site || null,
      web_content_owner: data.web_content_owner || null,
      seo_target_keywords: data.seo_target_keywords || null,
      seo_previous_attempts: data.seo_previous_attempts || null,
      ai_processes: data.ai_processes || null,
      ai_first_priority: data.ai_first_priority || null,
      crm_pipeline: data.crm_pipeline || null,
      crm_previous_attempt: data.crm_previous_attempt || null,
      q_visual_inspiration: data.q_visual_inspiration || null,
      q_visual_avoid: data.q_visual_avoid || null,
      q_concrete_result: data.q_concrete_result || null,
      q_business_stage: data.q_business_stage || null,
      q_business_stage_detail: data.q_business_stage_detail || null,
      q_origin: data.q_origin || null,
      q_previous_attempts: data.q_previous_attempts || null,
      q_internal_obstacle: data.q_internal_obstacle || null,
      q_concrete_result_brand: data.q_concrete_result_brand || null,
      web_goal: data.web_goal || null,
      seo_goal: data.seo_goal || null,
    })
    .select()
    .single();

  if (subError) {
    console.error('[submission-service] Error saving submission:', subError.message, subError.details, subError.hint);
    throw new Error(`Error saving submission: ${subError.message}`);
  }

  // Update status to completed
  await supabaseAdmin
    .from("discovery_forms")
    .update({ status: "completed" })
    .eq("id", formMeta.id);

  console.log('[submission-service] Saved to DB and marked form as completed');

  // 3. GENERATE PDF
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
    console.log('[submission-service] PDF generated');

    // 4. UPLOAD TO STORAGE
    const fileName = `pdfs/${slug}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("discovery")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf"
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabaseAdmin.storage
          .from("discovery")
          .getPublicUrl(fileName);
      pdfUrl = publicUrlData.publicUrl;

      await supabaseAdmin
          .from("discovery_submissions")
          .update({ pdf_url: pdfUrl })
          .eq("id", subData.id);
    }
  } catch (pdfErr) {
    console.error('[submission-service] PDF generation failed:', pdfErr);
  }

  // 5. SEND EMAIL
  let emailSent = false;
  let emailError = null;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailPayload: any = {
      from: process.env.FROM_EMAIL || "Noctra Studio Discovery <discovery@noctra.studio>",
      to: process.env.TO_EMAIL || "hello@noctra.studio",
      subject: `Discovery completado — ${formMeta.client_name}`,
      html: buildEmailHTML(data, formMeta, !!pdfBuffer),
    };

    if (pdfBuffer) {
      emailPayload.attachments = [
        {
          filename: `Discovery_${formMeta.client_name.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
        }
      ];
    }

    const emailResult = await resend.emails.send(emailPayload);
    if (emailResult.error) {
      emailError = emailResult.error;
    } else {
      emailSent = true;
    }
  } catch (emailErr: any) {
    emailError = emailErr.message;
  }

  return {
    success: true,
    pdfUrl,
    emailSent,
    emailError
  };
}

function buildEmailHTML(data: any, form: any, hasPdf: boolean): string {
  const accentColor = "#00E5A0"; // Noctra Green
  
  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                 max-width:600px;margin:0 auto;padding:60px 24px;background:#080808;color:#ffffff">
      
      <div style="margin-bottom:48px">
        <h1 style="font-size:32px;font-weight:900;margin:0;letter-spacing:-0.04em;text-transform:uppercase">
          ${form.client_name}
        </h1>
        <div style="width:40px;height:2px;background:${accentColor};margin-top:16px"></div>
      </div>

      <div style="margin-bottom:48px">
        <p style="font-size:18px;line-height:1.6;color:#ececeb;margin:0">
          Ha concluido el formulario de discovery.
        </p>
      </div>

      <div style="margin-bottom:60px">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/es/admin/forms/${form.id}"
           style="display:inline-block;background:#ffffff;color:#000000;padding:16px 32px;
                  border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;
                  text-transform:uppercase;letter-spacing:0.1em">
          Ver respuestas completas en Noctra Discovery →
        </a>
      </div>

      <div style="padding-top:32px;border-top:1px solid #222">
        <p style="font-size:11px;color:#555;margin:0;letter-spacing:0.05em;text-transform:uppercase">
          ${hasPdf ? 'El reporte técnico detallado está adjunto en este correo.' : 'El reporte técnico se está generando y estará disponible en el panel.'}
        </p>
      </div>

      <div style="margin-top:40px">
        <p style="font-size:10px;color:#333;margin:0;letter-spacing:0.2em;text-transform:uppercase">
          Noctra Studio
        </p>
      </div>
    </body></html>
  `;
}
