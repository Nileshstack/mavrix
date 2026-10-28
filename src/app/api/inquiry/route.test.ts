import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { siteContent } from "@/src/content/site";

const validPayload = {
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 555 123 4567",
  company: "",
  serviceInterest:
    siteContent.contactSection.form.fields.serviceInterest.options[0],
  projectDetails: "We would like to discuss a new platform build.",
  website: "",
};

describe("POST /api/inquiry", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns field issues for invalid payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validPayload, email: "invalid" }),
      }),
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      error: "invalid_inquiry",
      issues: [expect.objectContaining({ field: "email" })],
    });
  });

  it("logs valid inquiries and returns success", async () => {
    const logger = vi.spyOn(console, "info").mockImplementation(() => {});
    const response = await POST(
      new Request("http://localhost/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(logger).toHaveBeenCalledWith("Inquiry received", validPayload);
  });

  it("returns a decoy success for a filled honeypot without logging", async () => {
    const logger = vi.spyOn(console, "info").mockImplementation(() => {});
    const response = await POST(
      new Request("http://localhost/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validPayload, website: "spam" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(logger).not.toHaveBeenCalled();
  });
});
