import { NextRequest, NextResponse } from "next/server";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { guardAdminRoute } from "@/lib/adminAuthGuard";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const data = await afiaAdmin.listInspirationVideos();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const body = await req.json();
    const data = await afiaAdmin.createInspirationVideo(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
