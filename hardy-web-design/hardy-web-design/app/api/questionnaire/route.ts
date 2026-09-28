import { NextResponse } from "next/server";
import { Resend } from "resend";
import { cleanAnswers } from "@/lib/questions";
import { buildQuestionnairePdf } from "@/lib/pdf";
import { STUDIO_NAME } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read your answers. Please try again." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field; bots usually do.
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { answers, errors } = cleanAnswers(body.answers);
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or NOTIFY_EMAIL environment variable.");
    return NextResponse.json(
      { error: "The questionnaire isn't accepting submissions right now. Please email us directly." },
      { status: 503 }
    );
  }

  const client = String(answers.business_name || answers.contact_name);
  const pdf = await buildQuestionnairePdf(answers, { studio: STUDIO_NAME, submittedAt: new Date() });
  const fileSlug = client.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "client";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || `${STUDIO_NAME} <onboarding@resend.dev>`,
    to: [to],
    replyTo: String(answers.contact_email),
    subject: `New questionnaire: ${client}`,
    html: `<p>New website questionnaire from <b>${escapeHtml(client)}</b> (${escapeHtml(
      String(answers.contact_name)
    )}).</p><p>Reply to this email to answer them directly. Their full answers are in the attached PDF.</p>`,
    attachments: [{ filename: `${fileSlug}-website-questionnaire.pdf`, content: Buffer.from(pdf) }],
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Your answers didn't send. Please try again in a minute, or email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
