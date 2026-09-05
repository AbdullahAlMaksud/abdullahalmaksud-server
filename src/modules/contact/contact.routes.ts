import { Hono } from "hono";
import type { AppEnv } from "../../lib/types.js";
import { handleContactInquiry } from "./contact.controller.js";

export const contactRoutes = new Hono<AppEnv>();

// Direct Inquiry / Contact Form endpoints
contactRoutes.post("/contact", handleContactInquiry);
contactRoutes.post("/contact/send", handleContactInquiry);
contactRoutes.post("/send-email", handleContactInquiry);
