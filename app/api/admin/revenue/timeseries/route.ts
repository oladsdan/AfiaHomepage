import { NextRequest, NextResponse } from "next/server";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { guardAdminRoute } from "@/lib/adminAuthGuard";

export const dynamic = "force-dynamic";

const VALID_GRANULARITY = ["day", "week", "month"] as const;
type Granularity = (typeof VALID_GRANULARITY)[number];

export async function GET(req: NextRequest) {
  const guard = guardAdminRoute();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const granularityRaw = searchParams.get("granularity");
    const granularity =
      granularityRaw && (VALID_GRANULARITY as readonly string[]).includes(granularityRaw)
        ? (granularityRaw as Granularity)
        : undefined;
    const data = await afiaAdmin.getRevenueTimeseries({ from, to, granularity });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof AfiaAdminError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
