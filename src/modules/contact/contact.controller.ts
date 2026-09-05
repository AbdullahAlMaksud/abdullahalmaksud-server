import type { Context } from "hono";
import type { AppEnv } from "../../lib/types.js";
import { sendInquiryEmail } from "../../lib/email.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Handle direct consultation / contact inquiry submissions
 * POST /api/v1/contact
 */
export const handleContactInquiry = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return c.json(
        {
          success: false,
          error: "Invalid JSON body.",
        },
        400
      );
    }

    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return c.json(
        {
          success: false,
          error: "All fields (name, email, subject, message) are required.",
        },
        400
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(String(email).trim())) {
      return c.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        400
      );
    }

    const result = await sendInquiryEmail({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: result.message || "Failed to send email via Resend.",
        },
        500
      );
    }

    return c.json({
      success: true,
      message: result.message,
      data: result.data,
      simulated: result.simulated ?? false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ [CONTACT CONTROLLER] Error:", error);
    return c.json(
      {
        success: false,
        error: message,
      },
      500
    );
  }
};
