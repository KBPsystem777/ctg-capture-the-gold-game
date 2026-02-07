import crypto from "crypto";

export interface LedgerTransaction {
  id: string;
  gold_weight_kg: number;
  date: string;
  location: string;
  status: "confirmed" | "pending" | "disputed";
  seller: string;
  buyer: string;
}

// The global static ledger has been removed. Use per-session ledgers from `session-ledger`.
// Compute SHA-256 hash of a provided ledger for immutability verification
export function computeLedgerHash(transactions: LedgerTransaction[]): string {
  const ledgerString = JSON.stringify(transactions, null, 2);
  return crypto.createHash("sha256").update(ledgerString).digest("hex");
}

// NOTE: getLedger() is intentionally removed. Callers should obtain session-specific transactions from `session-ledger`.
export function getLedger(): LedgerTransaction[] {
  throw new Error(
    "Global static ledger removed. Use session-ledger (createSession) to obtain session transactions.",
  );
}

// Verify if a transaction exists (by ID or partial matching)
export function verifyTransactionInList(
  transactions: LedgerTransaction[],
  goldWeight: number,
  date: string,
  location: string,
): LedgerTransaction | null {
  return (
    transactions.find(
      (tx) =>
        tx.gold_weight_kg === goldWeight &&
        tx.date === date &&
        tx.location.toLowerCase().includes(location.toLowerCase()),
    ) || null
  );
}

// Legacy verification against static ledger (removed)
export function verifyTransaction(
  goldWeight: number,
  date: string,
  location: string,
): LedgerTransaction | null {
  throw new Error(
    "Legacy global ledger removed. Use verifyTransactionInList with a session's transactions.",
  );
}
