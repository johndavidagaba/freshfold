import nodemailer from "nodemailer";
import { verificationEmailHtml } from "@/lib/emailTemplate";

export async function sendVerificationEmail(
  to: string,
  name: string,
  code: string
): Promise<void> {
  const start = performance.now();

  try {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || 465);

    if (!host || !user || !pass) {
      throw new Error("SMTP environment variables are not configured");
    }

    const transport = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: { user, pass },
    });

    await transport.sendMail({
      from: user,
      to,
      subject: "Your FreshFold verification code",
      html: verificationEmailHtml(name, code),
    });

    console.log(
      `[mail] sent to ${to} in ${Math.round(performance.now() - start)}ms`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
