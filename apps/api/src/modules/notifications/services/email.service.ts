import { Resend } from "resend";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string =
    process.env.EMAIL_FROM || "Samud Shabkat <orders@samudshabkat.com>";

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(input: SendEmailInput): Promise<boolean> {
    try {
      if (this.resend) {
        const response = await this.resend.emails.send({
          from: this.fromEmail,
          to: [input.to],
          subject: input.subject,
          html: input.html,
        });

        if (response.error) {
          console.warn(`[EmailService] Resend API error:`, response.error);
          return false;
        }

        console.log(
          `[EmailService] Sent email to ${input.to} via Resend. Email ID: ${response.data?.id}`,
        );
        return true;
      }

      // Development console fallback when RESEND_API_KEY is not configured
      console.log(
        `\n================ [DEV EMAIL PREVIEW] ================\nTo: ${input.to}\nFrom: ${this.fromEmail}\nSubject: ${input.subject}\nHTML Content (truncated):\n${input.html.slice(0, 300)}...\n======================================================\n`,
      );
      return true;
    } catch (err) {
      console.error(`[EmailService] Failed to send email to ${input.to}:`, err);
      return false;
    }
  }
}

export const emailService = new EmailService();
