import { NextRequest, NextResponse } from "next/server";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { guardAdminRoute } from "@/lib/adminAuthGuard";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const data = await afiaAdmin.getUser(params.id);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const data = await afiaAdmin.deleteUser(params.id);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
