import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown SMTP error";
    return NextResponse.json({ error: `SMTP error: ${details}` }, { status: 500 });
  }
}
