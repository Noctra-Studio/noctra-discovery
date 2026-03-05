import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { Resend } from "resend";
import { buildPDFHtml } from "@/lib/pdf-template";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { submissionSchema } from "@/lib/validations";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1h"),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Capa 1: Rate Limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  console.log('[submit] ▶ Iniciando submit');
  console.log('[submit] RESEND_API_KEY:', !!process.env.RESEND_API_KEY);
  console.log('[submit] TO_EMAIL:', process.env.TO_EMAIL);

  try {
    // Capa 2: Validación Zod
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      console.warn("[submit] Payload inválido:", parsed.error.flatten());
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const { slug, data, language = 'es' } = parsed.data;

    if (!slug || !data) {
      console.error('[submit] ✗ Faltan campos requeridos');
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. VALIDATE FORM
    console.log('[submit] Buscando formulario en Supabase...');
    const { data: formMeta, error: formError } = await supabaseAdmin
      .from("discovery_forms")
      .select("*")
      .eq("slug", slug)
      .single();

    if (formError || !formMeta) {
      console.error('[submit] ✗ Formulario no encontrado:', slug);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (formMeta.status === "completed") {
      console.warn('[submit] ⚠ Formulario ya completado');
      return NextResponse.json({ error: "Form already completed" }, { status: 409 });
    }

    // 2. SAVE TO DB (SIEMPRE)
    console.log('[submit] Guardando en Supabase...');
    const { data: subData, error: subError } = await supabaseAdmin
      .from("discovery_submissions")
      .insert({
        form_id: formMeta.id,
        responses: data,
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
      console.error('[submit] ✗ Error al guardar submisión:', subError);
      return NextResponse.json({ error: "Error saving submission" }, { status: 500 });
    }

    // Update status to completed
    await supabaseAdmin
      .from("discovery_forms")
      .update({ status: "completed" })
      .eq("id", formMeta.id);

    console.log('[submit] ✓ Guardado en Supabase exitoso');

    // 3. GENERATE PDF (enriquecido con try/catch)
    console.log('[submit] Generando PDF...');
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
      console.log('[submit] ✓ PDF generado, tamaño:', pdfBuffer.length);

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
        console.log('[submit] ✓ PDF subido y URL actualizada');
      } else {
          console.error('[submit] ✗ Error al subir PDF:', uploadError);
      }

    } catch (pdfErr: any) {
      console.error('[submit] ✗ Falló generación de PDF (continuando sin PDF):', pdfErr.message, pdfErr);
    }

    // 5. SEND EMAIL (SIEMPRE, con o sin PDF)
    console.log('[submit] Enviando email...');
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
            content: pdfBuffer.toString("base64"),
          }
        ];
      }

      const emailResult = await resend.emails.send(emailPayload);
      console.log('[submit] ✓ Resultado email:', JSON.stringify(emailResult));

      // Marcar como enviado si tenemos tracking por campo (opcional)
      // await updateEmailSentAt(formMeta.id); 

    } catch (emailErr: any) {
      console.error('[submit] ✗ El email falló:', emailErr.message, emailErr);
    }

    return NextResponse.json({ success: true, pdfUrl });
  } catch (error: any) {
    console.error('[submit] ✗ Unhandled error in submit route:', error.message, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildEmailHTML(data: any, form: any, hasPdf: boolean): string {
  const rows = [
    ['Empresa', form.client_name],
    ['Dirigido a', form.directed_to],
    ['Origen', data.q_origin],
    ['Cliente Ideal', data.q_ideal_client],
    ['Diferenciador', data.q_differentiator],
    ['Business Stage', data.q_business_stage ? `${data.q_business_stage}${data.q_business_stage_detail ? `: ${data.q_business_stage_detail}` : ''}` : null],
    ['Resultado concreto', data.q_concrete_result],
    ['Inspiración visual', data.q_visual_inspiration],
    ['Evitar visualmente', Array.isArray(data.q_visual_avoid) ? data.q_visual_avoid.join(', ') : data.q_visual_avoid],
    ['Color acento', data.q_accent_color ? `${data.q_accent_color_name} (${data.q_accent_color})` : null],
    ['Jamás será', data.q_never],
    ['Objetivo web', data.web_goal],
    ['Prioridad AI', data.ai_first_priority],
    ['Cuello de botella CRM', data.crm_main_goal],
  ].filter(([, v]) => v);

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;background:#f7f7f5;font-size:10px;font-weight:600;
                 color:#888;text-transform:uppercase;letter-spacing:0.05em;
                 white-space:nowrap;vertical-align:top;width:1%">${label}</td>
      <td style="padding:10px 12px;border-left:2px solid #080808;font-size:13px;
                 color:#333;line-height:1.6">${String(value).replace(/\n/g, '<br>')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;
                 padding:40px 24px;background:#ffffff;color:#111">
      <div style="border-left:3px solid #080808;padding-left:20px;margin-bottom:32px">
        <h1 style="font-size:20px;font-weight:700;margin:0 0 4px">${form.client_name}</h1>
        <p style="color:#888;margin:0;font-size:12px">
          Discovery completado ·
          ${new Date().toLocaleDateString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
        ${tableRows}
      </table>

      <div style="padding:16px 20px;background:#f7f7f5;border-left:2px solid #080808">
        <p style="font-size:11px;color:#888;margin:0;line-height:1.6">
          ${hasPdf ? 'El PDF completo está adjunto.' : 'El PDF se generará en el panel.'}<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/es/admin/forms/${form.id}"
             style="color:#080808;font-weight:600;font-size:12px">
            Ver respuestas completas en Noctra Discovery →
          </a>
        </p>
      </div>
    </body></html>
  `;
}

export const maxDuration = 60;
