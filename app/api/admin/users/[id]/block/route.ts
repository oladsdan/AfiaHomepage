import { NextRequest, NextResponse } from "next/server";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { guardAdminRoute } from "@/lib/adminAuthGuard";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  let body: { isBlocked?: unknown; reason?: unknown };
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json(
        { success: false, message: "Request body must be a JSON object" },
        { status: 400 }
      );
    }
    body = parsed as { isBlocked?: unknown; reason?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (typeof body.isBlocked !== "boolean") {
    return NextResponse.json(
      { success: false, message: "isBlocked must be a boolean" },
      { status: 400 }
    );
  }

  try {
    const data = await afiaAdmin.blockUser(params.id, {
      isBlocked: body.isBlocked,
      reason: typeof body.reason === "string" ? body.reason : undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
