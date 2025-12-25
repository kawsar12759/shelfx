export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    secretPrefix: process.env.CLERK_SECRET_KEY?.slice(0, 20) ?? null,
    publishablePrefix: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 25) ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}