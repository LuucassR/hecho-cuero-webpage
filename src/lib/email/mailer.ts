import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getMailer() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "Faltan las variables de entorno GMAIL_USER / GMAIL_APP_PASSWORD para enviar emails.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

export const MAIL_FROM = `"Hecho Cuero" <${process.env.GMAIL_USER}>`;
