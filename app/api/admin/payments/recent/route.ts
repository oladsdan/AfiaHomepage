import { NextRequest, NextResponse } from "next/server";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { guardAdminRoute } from "@/lib/adminAuthGuard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const data = await afiaAdmin.listRecentPayments({ page, limit });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
