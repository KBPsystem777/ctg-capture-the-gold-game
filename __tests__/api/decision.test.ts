import { NextRequest } from "next/server";
import { POST } from "@/app/api/decision/route";
import { createSession } from "@/lib/session-ledger";

// Mock cookies
const mockRequest = (body: any, sessionId?: string) => {
  const req = new NextRequest("http://localhost/api/decision", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (sessionId) {
    req.cookies.set("ctg_session", sessionId);
  }
  return req;
};

describe("Decision API", () => {
  it("correctly identifies a legitimate claim in the session ledger", async () => {
    // Create a session which will contain some claims from SAMPLE_CLAIMS
    const session = createSession(10);

    // Find the injected legit claim in the session ledger
    const legitTx = session.transactions.find((t) =>
      t.id.startsWith("TXN-LEGIT-"),
    );
    if (!legitTx) return; // skip if none injected (random)

    const payload = {
      decision: "approved",
      goldWeight: legitTx.gold_weight_kg,
      claimDate: legitTx.date,
      location: legitTx.location,
    };

    const res = await POST(mockRequest(payload, session.id));
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.evaluation.regulatorCorrect).toBe(true);
    expect(typeof data.evaluation.explanation).toBe("string");
    expect(Array.isArray(data.evaluation.basis?.matchedFields)).toBe(true);
  });

  it("identifies an incorrect approval for a non-existent transaction", async () => {
    const session = createSession(10);

    const payload = {
      decision: "approved",
      goldWeight: 9999, // clearly fake
      claimDate: "2099-01-01",
      location: "Moon Base",
    };

    const res = await POST(mockRequest(payload, session.id));
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.evaluation.regulatorCorrect).toBe(false);
    expect(typeof data.evaluation.explanation).toBe("string");
    expect(Array.isArray(data.evaluation.basis?.closestMatches)).toBe(true);
  });
});
