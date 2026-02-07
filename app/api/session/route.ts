import { createSession, createSessionWithAI } from "@/lib/session-ledger";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const count = Math.floor(Math.random() * 4) + 4; // 4 to 7 transactions for variety

    // Prefer AI-generated Philippine-context ledgers when an OpenAI key is configured
    const session = process.env.OPENAI_API_KEY
      ? await createSessionWithAI(count)
      : createSession(count);

    const res = NextResponse.json({
      success: true,
      data: { sessionId: session.id, hash: session.hash },
    });

    // Set HttpOnly cookie for session binding
    res.cookies.set("ctg_session", session.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 },
    );
  }
}
