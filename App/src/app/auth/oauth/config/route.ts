import { NextResponse } from "next/server";
import { oauthConfig } from "@/lib/oauthConfig";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    const { tokenUrl, ...config } = oauthConfig();
    return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Alisa 登录尚未配置" }, { status: 503 });
  }
}
