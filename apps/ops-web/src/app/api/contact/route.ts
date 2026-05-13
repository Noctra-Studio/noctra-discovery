import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getBrandName } from "@/lib/site-config";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().min(2).max(160),
  stage: z.string().min(2).max(160),
  challenge: z.string().min(10).max(2500),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const to = process.env.CONTACT_EMAIL_TO;
    const from = process.env.CONTACT_EMAIL_FROM;
    const apiKey = process.env.RESEND_API_KEY;

    if (!to || !from || !apiKey) {
      return NextResponse.json(
        { error: "contact_not_configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const payload = parsed.data;

    await resend.emails.send({
      from,
      to,
      subject: `[${getBrandName()} · Contacto] ${payload.company} - ${payload.name}`,
      replyTo: payload.email,
      text: [
        `Locale: ${payload.locale ?? "es"}`,
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Company: ${payload.company}`,
        `Stage: ${payload.stage}`,
        "",
        "Challenge:",
        payload.challenge,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json({ error: "contact_failed" }, { status: 500 });
  }
}
