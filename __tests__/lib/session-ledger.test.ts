import {
  createSession,
  getSession,
  generateSessionLedger,
} from "@/lib/session-ledger";

describe("session ledger", () => {
  test("createSession returns a stored session and getSession can retrieve it", () => {
    const s = createSession(5);
    expect(s).toHaveProperty("id");
    expect(s.transactions.length).toBe(5);

    const fetched = getSession(s.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.hash).toBe(s.hash);
  });

  test("generateSessionLedger returns expected structure and hash is valid", () => {
    const { id, transactions, hash } = generateSessionLedger(3);
    expect(id).toBeTruthy();
    expect(transactions.length).toBe(3);
    // hash should be 64 hex chars
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
