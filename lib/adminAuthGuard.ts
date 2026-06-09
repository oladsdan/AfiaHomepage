import { NextResponse } from "next/server";

export function guardAdminRoute(): NextResponse | null {
  if (!process.env.AFIA_ADMIN_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message:
          "AFIA_ADMIN_API_KEY is not configured. Set it in Replit Secrets.",
      },
      { status: 503 }
    );
  }
  return null;
}
