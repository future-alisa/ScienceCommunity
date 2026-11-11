import { NextRequest, NextResponse } from "next/server";
import { oauthConfig } from "@/lib/oauthConfig";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const config = oauthConfig();
    if (request.headers.get("origin") !== new URL(config.redirectUri).origin) {
      return NextResponse.json({ message: "登录来源不匹配" }, { status: 403, headers });
    }
    const { code, verifier } = await request.json();
    if (typeof code !== "string" || !code || code.length > 4096 ||
        typeof verifier !== "string" || !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) {
      return NextResponse.json({ message: "登录参数无效" }, { status: 400, headers });
    }
    const response = await fetch(config.tokenUrl, {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code", client_id: config.clientId,
        redirect_uri: config.redirectUri, code, code_verifier: verifier,
      }),
    });
    if (!response.ok) return NextResponse.json({ message: "授权码交换失败" }, { status: 400, headers });
    const result = await response.json();
    return NextResponse.json({
      access_token: result.access_token, token_type: result.token_type, expires_in: result.expires_in,
    }, { headers });
  } catch {
    return NextResponse.json({ message: "授权服务暂时不可用" }, { status: 503, headers });
  }
}
