import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
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
  let pdfResult = { url: null as string | null, buffer: null as Buffer | null };
  try {
    pdfResult = await generateSubmissionPDF(subData.id);
  } catch (pdfErr) {
    console.error('[submission-service] Initial PDF generation failed:', pdfErr);
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
      html: buildEmailHTML(data, formMeta, !!pdfResult.buffer),
    };

    if (pdfResult.buffer) {
      emailPayload.attachments = [
        {
          filename: `Discovery_${formMeta.client_name.replace(/\s+/g, '_')}.pdf`,
          content: pdfResult.buffer,
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
    pdfUrl: pdfResult.url,
    emailSent,
    emailError
  };
}

export async function generateSubmissionPDF(submissionId: string) {
  console.log(`[submission-service] Manually generating PDF for submission: ${submissionId}`);

  // 1. Fetch submission data
  const { data: sub, error: subError } = await supabaseAdmin
    .from("discovery_submissions")
    .select(`
      *,
      form:discovery_forms(*)
    `)
    .eq("id", submissionId)
    .single();

  if (subError || !sub) {
    throw new Error("Submission not found");
  }

  const { responses, language, form, id: slugBase } = sub;
  const slug = form.slug;

  // 2. LAUNCH PUPPETEER
  // More robust local detection (Mac or development mode)
  const isLocal = process.env.NODE_ENV === "development" || process.platform === "darwin";
  let browser;
  
  if (isLocal) {
    console.log('[submission-service] Using local Puppeteer');
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    console.log('[submission-service] Using Chromium (Production/Vercel)');
    // Configuration for Vercel/Serverless
    try {
      // Optional: Set graphics mode to false to reduce dependencies (might help with brotli error)
      // Some versions of sparticuz/chromium have issues with brotli if not configured
      chromium.setGraphicsMode = false;
      
      const executablePath = await chromium.executablePath();
      
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: { width: 1200, height: 900 },
        executablePath: executablePath,
        headless: true, // Use boolean directly if property is missing from types
      });
    } catch (launchErr: any) {
      console.error('[submission-service] Chromium Launch Error:', launchErr);
      throw new Error(`Error al iniciar el navegador: ${launchErr.message}`);
    }
  }
  
  try {
    const page = await browser.newPage();
    await page.setContent(buildPDFHtml(responses, language, form), { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    
    const pdfBytes = await page.pdf({ 
      format: 'A4', 
      printBackground: true, 
      margin: { top: 0, right: 0, bottom: 0, left: 0 } 
    });
    
    await browser.close();
    const pdfBuffer = Buffer.from(pdfBytes);

    // 3. UPLOAD TO STORAGE
    const fileName = `pdfs/${slug}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("discovery")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
        .from("discovery")
        .getPublicUrl(fileName);
    
    const pdfUrl = publicUrlData.publicUrl;

    // 4. UPDATE DB
    await supabaseAdmin
        .from("discovery_submissions")
        .update({ pdf_url: pdfUrl })
        .eq("id", submissionId);

    return { url: pdfUrl, buffer: pdfBuffer };
  } catch (err) {
    if (browser) await browser.close();
    throw err;
  }
}

function buildEmailHTML(data: any, form: any, hasPdf: boolean): string {
  const accentColor = "#00E5A0"; // Noctra Green
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Discovery completado</title>
    </head>
    <body style="margin:0;padding:0;background-color:#000000;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000;min-height:100vh;">
        <tr>
          <td align="center" style="padding: 60px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;text-align:left;">
              <!-- Header/Logo Area -->
              <tr>
                <td style="padding-bottom: 48px;">
                  <h1 style="font-size:42px;font-weight:900;margin:0;letter-spacing:-0.05em;text-transform:uppercase;color:#ffffff;line-height:1;">
                    ${form.client_name}
                  </h1>
                  <table border="0" cellpadding="0" cellspacing="0" width="40" style="margin-top:20px;">
                    <tr><td height="2" style="background-color:${accentColor};line-height:2px;font-size:2px;">&nbsp;</td></tr>
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding-bottom: 48px;">
                  <p style="font-size:20px;line-height:1.5;color:#ffffff;margin:0;font-weight:300;">
                    Ha concluido el formulario de discovery.
                  </p>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding-bottom: 64px;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="border-radius:100px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/es/admin/forms/${form.id}"
                           style="display:inline-block;padding:18px 36px;font-family:sans-serif;font-size:12px;font-weight:700;line-height:1;text-align:center;text-decoration:none;text-transform:uppercase;letter-spacing:0.12em;color:#000000;background-color:#ffffff;border-radius:100px;border:1px solid #ffffff;">
                          Ver respuestas completas en Noctra Discovery →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding-top:32px;border-top:1px solid #222;">
                  <p style="font-size:11px;color:#666;margin:0;letter-spacing:0.08em;text-transform:uppercase;line-height:1.6;">
                    ${hasPdf ? 'El reporte técnico detallado está adjunto en este correo.' : 'El reporte técnico se está generando y estará disponible en el panel.'}
                  </p>
                </td>
              </tr>

              <!-- Brand Footer -->
              <tr>
                <td style="padding-top:48px;">
                  <p style="font-size:10px;color:#444;margin:0;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">
                    Noctra Studio
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
