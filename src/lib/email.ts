import { env } from "./env.js";

export interface SendOtpEmailParams {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}

/**
 * Sends a one-time password (OTP) email using the Resend REST API.
 * In development mode or if email dispatch fails, it logs the OTP directly to the terminal
 * so local testing is never blocked.
 */
export async function sendOtpEmail({ email, otp, type }: SendOtpEmailParams): Promise<void> {
  // Always log OTP to server terminal for instant debugging & local testing
  console.log("\n========================================================");
  console.log(`🔑 [AUTH OTP] Type: ${type} | Recipient: ${email}`);
  console.log(`👉 VERIFICATION CODE: ${otp}`);
  console.log("========================================================\n");

  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ [AUTH OTP] RESEND_API_KEY not found in environment. Code printed above for local use.");
    return;
  }

  const emailFrom = env.EMAIL_FROM || "Abdullah Al Maksud Admin <onboarding@resend.dev>";
  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [email],
        subject: `Your Admin Verification Code: ${otp}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh; padding: 48px 16px; background-color: #020617;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; text-align: center; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; margin-bottom: 14px;">
                <span style="font-size: 24px; vertical-align: middle;">🛡️</span>
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                Abdullah Al Maksud
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
                Admin Portal Verification
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Use the following 6-digit one-time code to authenticate your sign-in to the admin portal:
              </p>

              <!-- OTP Block -->
              <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 14px; padding: 22px 16px; text-align: center; margin: 24px 0;">
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #10b981; display: inline-block; padding-left: 10px;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; text-align: center;">
                ⏳ This code will expire in <strong style="color: #f1f5f9;">5 minutes</strong>.
              </p>

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e293b;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #64748b;">
                  If you didn't request this verification code, you can safely ignore this email. No changes will be made to your account.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 32px 24px 32px; background: #020617; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                © ${currentYear} Abdullah Al Maksud. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("⚠️ [AUTH OTP] Resend API responded with error:", response.status, errorText);
    } else {
      console.log(`✅ [AUTH OTP] Verification email dispatched successfully to ${email}`);
    }
  } catch (error) {
    console.error("❌ [AUTH OTP] Network/API error sending email:", error);
  }
}

export interface SendInquiryEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  data?: unknown;
  simulated?: boolean;
}

/**
 * Sends a portfolio consultation inquiry email using Resend.
 * If RESEND_API_KEY is not configured, logs to console in simulated mode.
 */
export async function sendInquiryEmail({
  name,
  email,
  subject,
  message,
}: SendInquiryEmailParams): Promise<SendEmailResult> {
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n========================================================");
    console.log("📨 [SIMULATED INQUIRY EMAIL] (No RESEND_API_KEY set)");
    console.log(`👤 Name: ${name}`);
    console.log(`📧 Email: ${email}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`💬 Message: ${message}`);
    console.log("========================================================\n");

    return {
      success: true,
      message:
        "Inquiry received successfully! (Simulated mode: Add RESEND_API_KEY to server .env to send real emails)",
      simulated: true,
    };
  }

  const recipient = env.CONTACT_RECIPIENT_EMAIL || "contact@abdullahalmaksud.com";
  const emailFrom = env.EMAIL_FROM || "Portfolio Inquiry <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [recipient],
        reply_to: email,
        subject: `[Inquiry: ${subject}] from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 12px; margin-top: 0; text-transform: uppercase;">
              New Direct Consultation Inquiry
            </h2>
            <div style="margin: 16px 0;">
              <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background-color: #f9f9f9; padding: 16px; border-left: 3px solid #000; margin-top: 16px; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold; margin-bottom: 8px;">Message:</p>
              <p style="white-space: pre-wrap; margin: 0; color: #333;">${message}</p>
            </div>
            <div style="margin-top: 24px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 12px;">
              Transmitted via Abdullah Al Maksud API (Resend Integration)
            </div>
          </div>
        `,
      }),
    });

    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok) {
      console.error("⚠️ [INQUIRY EMAIL] Resend API error:", response.status, data);
      const errMsg =
        (data && (typeof data.message === "string" ? data.message : typeof data.error === "string" ? data.error : null)) ||
        "Failed to send email via Resend.";
      return {
        success: false,
        message: errMsg,
      };
    }

    console.log(`✅ [INQUIRY EMAIL] Dispatched inquiry from ${email} to ${recipient}`);
    return {
      success: true,
      message: "Email sent successfully!",
      data,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("❌ [INQUIRY EMAIL] Network/Server error:", errorMsg);
    return {
      success: false,
      message: errorMsg,
    };
  }
}

