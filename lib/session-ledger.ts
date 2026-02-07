import crypto from "crypto";
import { LedgerTransaction } from "./ledger";
import { SAMPLE_CLAIMS } from "./game-state";

type StoredSession = {
  id: string;
  createdAt: number;
  expiresAt: number;
  transactions: LedgerTransaction[];
  hash: string;
};

const SESSIONS = new Map<string, StoredSession>();
const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

const LOCATIONS = [
  "Manila Office",
  "Singapore Vault",
  "Hong Kong Exchange",
  "Zurich Vault",
  "London Exchange",
];

const SELLERS = [
  "Aurelius Gold Trading",
  "Pacific Resources Ltd",
  "Orient Metals Inc",
  "Gilded Imports",
  "Auric Holdings",
];

const BUYERS = [
  "Central Bank of Philippines",
  "Reserve Bank",
  "Global Metal Fund",
];

function sha256(obj: any) {
  const str = JSON.stringify(obj, null, 2);
  return crypto.createHash("sha256").update(str).digest("hex");
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinMonths(months = 12) {
  const now = Date.now();
  const ms = 1000 * 60 * 60 * 24 * 30 * months;
  const t = now - Math.floor(Math.random() * ms);
  const d = new Date(t);
  return d.toISOString().slice(0, 10);
}

export function generateSessionLedger(count = 8): {
  id: string;
  transactions: LedgerTransaction[];
  hash: string;
} {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const transactions: LedgerTransaction[] = Array.from({ length: count }).map(
    (_, idx) => {
      const id = `TXN-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      return {
        id,
        gold_weight_kg: randomInt(50, 400),
        date: randomDateWithinMonths(12),
        location: LOCATIONS[randomInt(0, LOCATIONS.length - 1)],
        status: Math.random() > 0.05 ? "confirmed" : "pending",
        seller: SELLERS[randomInt(0, SELLERS.length - 1)],
        buyer: BUYERS[randomInt(0, BUYERS.length - 1)],
      };
    },
  );

  // Inject 1-2 legitimate claims from SAMPLE_CLAIMS into the ledger so not all claims are "lies"
  const injectedIndices = new Set<number>();
  while (injectedIndices.size < Math.min(2, SAMPLE_CLAIMS.length)) {
    injectedIndices.add(randomInt(0, SAMPLE_CLAIMS.length - 1));
  }

  injectedIndices.forEach((claimIdx) => {
    const claim = SAMPLE_CLAIMS[claimIdx];
    // Replace a random entry with a matching one
    const replaceIdx = randomInt(0, transactions.length - 1);
    transactions[replaceIdx] = {
      id: `TXN-LEGIT-${claim.id}`,
      gold_weight_kg: claim.gold_weight_kg,
      date: claim.claimed_date,
      location: claim.claimed_location,
      status: "confirmed",
      seller: claim.claimant_name,
      buyer: BUYERS[0],
    };
  });

  const hash = sha256(transactions);

  return { id: sessionId, transactions, hash };
}

export function createSession(count = 8) {
  const { id, transactions, hash } = generateSessionLedger(count);
  const now = Date.now();
  const stored: StoredSession = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    transactions,
    hash,
  };
  SESSIONS.set(id, stored);
  return stored;
}

export function getSession(sessionId: string) {
  const s = SESSIONS.get(sessionId);
  if (!s) return null;
  // expire check
  if (Date.now() > s.expiresAt) {
    SESSIONS.delete(sessionId);
    return null;
  }
  return s;
}

export function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [k, v] of SESSIONS.entries()) {
    if (now > v.expiresAt) SESSIONS.delete(k);
  }
}

// Simple interval cleanup
setInterval(cleanupExpiredSessions, 1000 * 60 * 5);
