import { inquirySchema } from "@/src/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "invalid_json" }, { status: 400 });
    }
    throw error;
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "website" in payload &&
    typeof payload.website === "string" &&
    payload.website.length > 0
  ) {
    return Response.json({ success: true });
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_inquiry",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  console.info("Inquiry received", parsed.data);

  // TODO: Forward validated inquiries to the configured email or database integration.
  return Response.json({ success: true });
}
