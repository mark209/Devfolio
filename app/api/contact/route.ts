import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const CLEANUP_INTERVAL_MS = 5 * 60_000;

const ipBucket = new Map<string, { count: number; resetAt: number }>();
let lastCleanupAt = 0;

function cleanupRateLimitBucket(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return;
  }

  for (const [ip, state] of ipBucket.entries()) {
    if (state.resetAt <= now) {
      ipBucket.delete(ip);
    }
  }

  lastCleanupAt = now;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const firstForwarded = forwardedFor.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();

  return firstForwarded || realIp || cfIp || "unknown";
}

function isRateLimited(ip: string, now: number) {
  const current = ipBucket.get(ip);

  if (!current || current.resetAt <= now) {
    ipBucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeSingleLine(input: string) {
  return input.replace(/[\r\n]/g, " ").trim();
}

export async function POST(request: Request) {
  try {
    const now = Date.now();
    cleanupRateLimitBucket(now);
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp, now)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      website?: string;
    };

    if ((body.website ?? "").trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = normalizeSingleLine(body.name ?? "");
    const email = normalizeSingleLine(body.email ?? "");
    const subject = normalizeSingleLine(body.subject ?? "");
    const message = (body.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (name.length > 120 || email.length > 180 || subject.length > 180 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env.local."
        },
        { status: 500 }
      );
    }

    const smtpHost = process.env.SMTP_HOST!;
    const smtpPort = Number(process.env.SMTP_PORT);
    const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === "true";

    if (allowSelfSigned && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Email service is misconfigured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: !allowSelfSigned,
        servername: smtpHost
      }
    });

    const recipient = process.env.CONTACT_TO ?? "ejcubing@gmail.com";
    const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER!;

    await transporter.sendMail({
      from: `Portfolio Contact <${fromAddress}>`,
      to: recipient,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact SMTP send failed:", error);
    return NextResponse.json(
      { error: "Unable to send message right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
