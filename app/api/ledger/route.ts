import { getSession } from "@/lib/session-ledger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionParam = url.searchParams.get("session");

    // Require an explicit session (either via query param or cookie)
    let transactions: any = [];
    let hash: string | null = null;

    if (sessionParam) {
      const s = getSession(sessionParam);
      if (s) {
        transactions = s.transactions;
        hash = s.hash;
      } else {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 },
        );
      }
    } else {
      // Try cookie
      const rawCookie = request.cookies.get("ctg_session")?.value;
      const cookieSession = rawCookie?.trim();

      if (cookieSession) {
        const s = getSession(cookieSession);
        if (s) {
          transactions = s.transactions;
          hash = s.hash;
        } else {
          return NextResponse.json(
            { success: false, error: "Session expired or not found" },
            { status: 404 },
          );
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Session required. Create a session via POST /api/session.",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        hash,
        immutable: true,
        recordCount: transactions.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve ledger" },
      { status: 500 },
    );
  }
}
