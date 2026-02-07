import { NextRequest, NextResponse } from "next/server";
import { verifyTransactionInList } from "@/lib/ledger";
import { getSession } from "@/lib/session-ledger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { decision, claimId, goldWeight, claimDate, location } = body;

    if (!decision || !["approved", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision value" },
        { status: 400 },
      );
    }

    // Try to get session ledger
    const rawCookie = request.cookies.get("ctg_session")?.value;
    const cookieSession = rawCookie?.trim();
    let transactions: any = [];

    if (cookieSession) {
      const s = getSession(cookieSession);
      if (s) transactions = s.transactions;
    }

    // Verify claim against ledger
    const ledgerMatch = verifyTransactionInList(
      transactions,
      goldWeight,
      claimDate,
      location,
    );
    const isLedgerValid = ledgerMatch !== null;

    // Determine if decision matches ledger truth
    const correctDecision = isLedgerValid ? "approved" : "rejected";
    const regulatorCorrect = decision === correctDecision;

    // Build explanation and basis
    const basis: any = { matchedFields: [], closestMatches: [] };

    if (isLedgerValid && ledgerMatch) {
      if (ledgerMatch.gold_weight_kg === goldWeight)
        basis.matchedFields.push("gold_weight_kg");
      if (ledgerMatch.date === claimDate) basis.matchedFields.push("date");
      if (ledgerMatch.location.toLowerCase().includes(location.toLowerCase()))
        basis.matchedFields.push("location");

      const explanation = `Ledger transaction ${ledgerMatch.id} matches the claim on ${basis.matchedFields.join(", ")}. The ledger is authoritative; therefore this claim is recorded as VALID.`;

      return NextResponse.json({
        success: true,
        decision,
        claimId,
        ledgerMatch: { exists: true, transaction: ledgerMatch },
        evaluation: {
          regulatorCorrect,
          message: regulatorCorrect
            ? "Your decision aligns with the ledger record. Excellent regulatory judgment."
            : `Your decision conflicts with the ledger. The claim was actually VALID.`,
          explanation,
          basis,
        },
      });
    }

    // No exact ledger match: find partials for educational feedback
    const partials = transactions
      .map((tx: any) => {
        const m: any = { id: tx.id, matches: [] as string[] };
        if (tx.gold_weight_kg === goldWeight) m.matches.push("gold_weight_kg");
        if (tx.date === claimDate) m.matches.push("date");
        if (tx.location.toLowerCase().includes(location.toLowerCase()))
          m.matches.push("location");
        return m;
      })
      .filter((m: any) => m.matches.length > 0)
      .slice(0, 2);

    basis.closestMatches = partials;

    const explanation = partials.length
      ? `No exact ledger entry found. Closest ledger entries match on: ${partials
          .map((p: any) => `${p.id} (${p.matches.join(", ")})`)
          .join(
            "; ",
          )}. Check the claimed weight, date, and location against the ledger entries.`
      : `No matching ledger entries were found for the claimed weight, date, or location. The ledger does not appear to record this transaction.`;

    return NextResponse.json({
      success: true,
      decision,
      claimId,
      ledgerMatch: { exists: false, transaction: null },
      evaluation: {
        regulatorCorrect,
        message: regulatorCorrect
          ? "Your decision aligns with the ledger record."
          : `Your decision conflicts with the ledger. The claim was actually INVALID.`,
        explanation,
        basis,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process decision" },
      { status: 500 },
    );
  }
}
