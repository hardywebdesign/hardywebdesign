import { NextResponse } from "next/server";
import { Resend } from "resend";
import { STUDIO_NAME } from "@/lib/site";

export const runtime = "nodejs";

// Short contact form on the home page (public/index.html). Sends through the same Resend setup as the questionnaire.
const LIMITS = { name: 120, email: 200, topic: 120, message: 5000 };

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read your message. Please try again." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field; bots usually do.
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const field = (key: keyof typeof LIMITS) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const name = field("name");
  const email = field("email");
  const topic = field("topic");
  const message = field("message");

  const errors: string[] = [];
  if (!name) errors.push("Please add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please add a valid email address.");
  if (!message) errors.push("Please add a message.");
  for (const [key, max] of Object.entries(LIMITS)) {
    if (field(key as keyof typeof LIMITS).length > max) errors.push(`Your ${key} is too long.`);
  }
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or NOTIFY_EMAIL environment variable.");
    return NextResponse.json(
      { error: "The contact form isn't working right now. Please try again later." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || `${STUDIO_NAME} <onboarding@resend.dev>`,
    to: [to],
    replyTo: email,
    subject: `New message from ${name}${topic ? `: ${topic}` : ""}`,
    html: `<p><b>${escapeHtml(name)}</b> (${escapeHtml(email)}) sent a message through the website.</p>
<p><b>About:</b> ${escapeHtml(topic || "Not specified")}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<p>Reply to this email to answer them directly.</p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Your message didn't send. Please try again in a minute." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
