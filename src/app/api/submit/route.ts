import { NextRequest, NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validations";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { processSubmission } from "@/lib/submission-service";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit_submit",
});

export async function POST(req: NextRequest) {
  try {
    // 1. RATE LIMIT
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success: limitOk } = await ratelimit.limit(ip);
    if (!limitOk) {
      return NextResponse.json(
        { error: "Too many submissions. Try again later." },
        { status: 429 }
      );
    }

    // 2. VALIDATE PAYLOAD
    const body = await req.json();
    const validated = submissionSchema.safeParse(body.data);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { slug, language } = body;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // 3. PROCESS SUBMISSION
    const result = await processSubmission(slug, validated.data, language);

    return NextResponse.json({
      success: true,
      emailSent: result.emailSent,
      emailError: result.emailError,
    });

  } catch (error: any) {
    console.error("[api/submit] Global Error:", error);
    
    if (error.message === "Form not found") {
      return NextResponse.json({ error: "No se encontró el formulario solicitado." }, { status: 404 });
    }
    
    if (error.message === "Form already completed") {
      return NextResponse.json({ error: "Formulario ya completado." }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Ha ocurrido un error inesperado al procesar tu solicitud." },
      { status: 500 }
    );
  }
}
