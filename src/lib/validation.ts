import { z } from "zod";
import { siteContent } from "@/src/content/site";

const serviceOptions = siteContent.contactSection.form.fields.serviceInterest
  .options;

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(32),
  company: z.string().trim().max(120).optional().default(""),
  serviceInterest: z.enum(serviceOptions),
  projectDetails: z.string().trim().min(10).max(5000),
  website: z.string().max(0),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;
